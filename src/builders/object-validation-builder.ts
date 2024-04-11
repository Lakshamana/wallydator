import { ValidationFunction } from '@/types'
import { ValidationBuilder } from '@/builders/abstract'
import { ValidationStage } from '@/builders/stages'
import { ValidationError, ValidationStageDescriptor, ValidationTestFn } from '@/interfaces'

export class ObjectValidationBuilder extends ValidationBuilder {
  protected readonly validationPipelines: Map<string, ValidationStageDescriptor[]> = new Map([])
  protected fieldName: string = ''

  public setNewValidationPipeline (fieldName: string): void {
    this.fieldName = fieldName
    this.validationPipelines.set(fieldName, [])
  }

  public override addValidationPipeline (
    validationName: string,
    validationFn: ValidationTestFn
  ): void {
    const validationPipeline = this.validationPipelines.get(this.fieldName)
    validationPipeline?.push({ validationName, validationFn })
  }

  from (source: Object): ObjectValidationBuilder {
    this.source = source
    return this
  }

  field (
    fieldName: string,
    validationFn: ValidationFunction
  ): ObjectValidationBuilder {
    this.setNewValidationPipeline(fieldName)
    validationFn(new ValidationStage(this))
    return this
  }

  build (): ValidationError | null {
    const errors: ValidationError = {}

    this.validationPipelines.forEach((validations, key) => {
      for (const { validationName, validationFn } of validations) {
        let hasError = false
        const result = validationFn(this.source[key])
        const resultIsObject = typeof result === 'object' && result && Object.keys(result).length

        if (result === false) {
          hasError = true
        } else if (resultIsObject) {
          hasError = true
        }

        if (hasError) {
          if (result === false) {
            errors[key] ||= []
            errors[key].push(validationName)
          } else if (resultIsObject) {
            const [firstError] = Object.keys(result)
            const [validationError] = result[firstError]
            const concatKey = `${key}.${firstError}`

            errors[concatKey] ||= []
            errors[concatKey].push(validationError)
          }
        }
      }
    })

    return Object.keys(errors).length ? errors : null
  }
}
