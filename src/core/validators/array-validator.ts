import {
  ValidationError,
  ValidationOptions,
  ValidationStageDescriptor,
  ValidationTestFn,
} from '@/interfaces'
import { Validator } from '@/core/abstract'
import { ArrayValidationStage, ValidationStage } from '@/core/stages'
import { NoSourceDefined } from '@/errors'
import { ValidationBuilder } from '../builders/validation-builder'

export class ArrayValidator extends Validator {
  private readonly validationPipeline: ValidationStageDescriptor[] = []
  private readonly rootValidationPipeline: ValidationStageDescriptor[] = []

  public override getSource(): any[] {
    return this.source
  }

  from(source?: any[]): ArrayValidator {
    this.source = source
    return this
  }

  public addValidationPipeline(
    validationName: string,
    validationFn: ValidationTestFn,
    opts?: ValidationOptions,
  ): void {
    this.validationPipeline.push({ validationName, validationFn, opts })
  }

  public addRootValidationPipeline(
    validationName: string,
    validationFn: ValidationTestFn,
    opts?: ValidationOptions,
  ): void {
    this.rootValidationPipeline.push({ validationName, validationFn, opts })
  }

  root(validationFn: (validator: ArrayValidationStage) => ArrayValidationStage) {
    validationFn(new ArrayValidationStage(this))
  }

  for(validationFn: (validator: ValidationStage) => ValidationStage) {
    validationFn(new ValidationStage(this))
  }

  public getCurrentValue(): any {
    return this.source
  }

  public build(): ValidationError | null {
    if (!this.source) {
      throw new NoSourceDefined()
    }

    const rootErrors: string[] = []
    this.rootValidationPipeline.forEach(({ validationFn, validationName, opts }) => {
      let result = validationFn(this.source)

      if (result instanceof ValidationBuilder) {
        result = result.build()
      }

      if (result === true) return

      let message = ''
      if (opts?.message) {
        message = typeof opts.message === 'function' ? opts.message(this.source) : opts.message
      }

      if (result === false) {
        rootErrors.push(message || validationName)
      } else if (typeof result === 'object' && !!result && Object.keys(result).length) {
        const [firstError] = Object.keys(result)
        const [validationError] = result[firstError]

        rootErrors.push(message || validationError)
      }
    })

    if (Object.keys(rootErrors).length) return { $root: rootErrors }

    const errors: ValidationError = {}
    this.validationPipeline.forEach(({ validationFn, validationName, opts }) => {
      this.getSource().forEach((item, idx) => {
        let result = validationFn(item)

        if (result instanceof ValidationBuilder) {
          result = result.build()
        }

        if (result === true) return

        let message = ''
        if (opts?.message) {
          message = typeof opts.message === 'function' ? opts.message(this.source) : opts.message
        }

        if (result === false) {
          errors[idx] ||= []
          errors[idx].push(message || validationName)
        } else if (typeof result === 'object' && result !== null && !!Object.keys(result).length) {
          Object.keys(result).forEach(errorKey => {
            const errorList = result[errorKey]
            const concatKey = `${idx}.${errorKey}`.replace(/(.*)\.$/g, '$1')

            errors[concatKey] ||= []
            errors[concatKey].push(...errorList)
          })
        }
      })
    })

    return Object.keys(errors).length ? errors : null
  }
}
