import { ArrayValidationFunction, ValidationFunction } from '@/types'
import {
  ArrayValidationBuilderContract,
  ValidationError,
  ValidationStageDescriptor,
  ValidationTestFn,
} from '@/interfaces'
import { ValidationBuilder } from '@/builders/abstract'
import { ArrayValidationStage, ValidationStage } from '@/builders/stages'
import { NoSourceDefined } from '@/errors'

export class ArrayValidationBuilder
  extends ValidationBuilder
  implements ArrayValidationBuilderContract
{
  private readonly validationPipeline: ValidationStageDescriptor[] = []
  private readonly rootValidationPipeline: ValidationStageDescriptor[] = []

  public override getSource(): any[] {
    return this.source
  }

  from(source?: any[]): ArrayValidationBuilder {
    this.source = source
    return this
  }

  public addValidationPipeline(validationName: string, validationFn: ValidationTestFn): void {
    this.validationPipeline.push({ validationName, validationFn })
  }

  public addRootValidationPipeline(validationName: string, validationFn: ValidationTestFn): void {
    this.rootValidationPipeline.push({ validationName, validationFn })
  }

  root(validationFn: ArrayValidationFunction): ArrayValidationBuilder {
    validationFn(new ArrayValidationStage(this))
    return this
  }

  for(validationFn: ValidationFunction): ArrayValidationBuilder {
    validationFn(new ValidationStage(this))
    return this
  }

  public getCurrentValue(): any {
    return this.source
  }

  public build(): ValidationError | null {
    if (!this.source) {
      throw new NoSourceDefined()
    }

    const rootErrors: string[] = []
    this.rootValidationPipeline.forEach(({ validationFn, validationName }) => {
      let result = validationFn(this.source)

      if (result instanceof ValidationBuilder) {
        result = result.build()
      }

      if (result === true) return

      if (result === false) {
        rootErrors.push(validationName)
      } else if (typeof result === 'object' && !!result && Object.keys(result).length) {
        const [firstError] = Object.keys(result)
        const [validationError] = result[firstError]

        rootErrors.push(validationError)
      }
    })

    if (Object.keys(rootErrors).length) return { $root: rootErrors }

    const errors: ValidationError = {}
    this.validationPipeline.forEach(({ validationFn, validationName }) => {
      this.getSource().forEach((item, idx) => {
        let result = validationFn(item)

        if (result instanceof ValidationBuilder) {
          result = result.build()
        }

        if (result === true) return

        if (result === false) {
          errors[idx] ||= []
          errors[idx].push(validationName)
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
