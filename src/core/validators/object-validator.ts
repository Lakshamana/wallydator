import { Validator } from '@/core/abstract'
import {
  ValidationError,
  ValidationFunction,
  ValidationOptions,
  ValidationStageDescriptor,
  ValidationTestFn,
} from '@/interfaces'
import { NoSourceDefined } from '@/errors'
import { ValidationStage } from '../stages'
import { ValidationBuilder } from '../builders/validation-builder'

export class ObjectValidator extends Validator {
  protected readonly validationPipelines: Map<string, ValidationStageDescriptor[]> = new Map([])

  protected fieldName: string = ''

  public setNewValidationPipeline(fieldName: string): void {
    this.fieldName = fieldName
    this.validationPipelines.set(fieldName, [])
  }

  from(source: Object): ObjectValidator {
    this.source = source
    return this
  }

  public addValidationPipeline(
    validationName: string,
    validationFn: ValidationTestFn,
    opts?: ValidationOptions,
  ): void {
    const validationPipeline = this.validationPipelines.get(this.fieldName)
    validationPipeline?.push({ validationName, validationFn, opts })
  }

  field(fieldName: string, validationFn: ValidationFunction) {
    this.setNewValidationPipeline(fieldName)
    validationFn(new ValidationStage(this))
  }

  public getCurrentValue(): any {
    return this.source[this.fieldName]
  }

  build(): ValidationError | null {
    if (!this.source) {
      throw new NoSourceDefined()
    }

    const errors: ValidationError = {}

    this.validationPipelines.forEach((validations, key) => {
      for (const { validationName, validationFn, opts } of validations) {
        let result = validationFn(this.source[key])

        if (result instanceof ValidationBuilder) {
          result = result.build()
        }

        if (result === true) continue

        if (result === false) {
          errors[key] ||= []

          let useMessage = ''
          if (opts?.message) {
            useMessage =
              typeof opts.message === 'function' ? opts.message(this.source[key]) : opts.message
          }

          errors[key].push(useMessage || validationName)
        } else if (typeof result === 'object' && result !== null && !!Object.keys(result).length) {
          for (const errorKey in result) {
            const errorList = result[errorKey]
            const concatKey = `${key}.${errorKey}`.replace(/(.*)\.$/g, '$1')

            errors[concatKey] ||= []
            errors[concatKey].push(...errorList)
          }
        }
      }
    })

    const filteredErrors = Object.keys(errors).reduce(
      (acc, k) => ({
        ...acc,
        [k.endsWith('.$root') ? k.replace('.$root', '') : k]: errors[k],
      }),
      {},
    )

    return Object.keys(filteredErrors).length ? filteredErrors : null
  }
}
