import { ValidationFunction } from '@/types'
import { ValidationBuilder } from '@/builders/abstract'
import {
  ObjectValidationBuilderContract,
  ValidationError,
  ValidationStageDescriptor,
  ValidationTestFn,
} from '@/interfaces'
import { NoSourceDefined } from '@/errors'
import { ValidationStage } from './stages'

export class ObjectValidationBuilder
  extends ValidationBuilder
  implements ObjectValidationBuilderContract
{
  protected readonly validationPipelines: Map<string, ValidationStageDescriptor[]> = new Map([])

  protected fieldName: string = ''

  public setNewValidationPipeline(fieldName: string): void {
    this.fieldName = fieldName
    this.validationPipelines.set(fieldName, [])
  }

  public addValidationPipeline(validationName: string, validationFn: ValidationTestFn): void {
    const validationPipeline = this.validationPipelines.get(this.fieldName)
    validationPipeline?.push({ validationName, validationFn })
  }

  from(source: Object): ObjectValidationBuilder {
    this.source = source
    return this
  }

  field(fieldName: string, validationFn: ValidationFunction): ObjectValidationBuilder {
    this.setNewValidationPipeline(fieldName)
    validationFn(new ValidationStage(this))
    return this
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
      for (const { validationName, validationFn } of validations) {
        let result = validationFn(this.source[key])

        if (result instanceof ValidationBuilder) {
          result = result.build()
        }

        if (result === true) continue

        if (result === false) {
          errors[key] ||= []
          errors[key].push(validationName)
        } else if (typeof result === 'object' && result !== null && !!Object.keys(result).length) {
          Object.keys(result).forEach(errorKey => {
            const errorList = result[errorKey]
            const concatKey = `${key}.${errorKey}`.replace(/(.*)\.$/g, '$1')

            errors[concatKey] ||= []
            errors[concatKey].push(...errorList)
          })
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
