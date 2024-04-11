import { ValidationFunction } from '@/types'
import { ArrayValidationStage } from '@/builders/stages'
import { ValidationError, ValidationStageDescriptor, ValidationTestFn } from '@/interfaces'
import { ValidationBuilder } from '@/builders/abstract'

export class ArrayValidationBuilder extends ValidationBuilder {
  private readonly validationPipeline: ValidationStageDescriptor[] = []

  public override getSource (): any[] {
    return this.source
  }

  from (source: any[]): ArrayValidationBuilder {
    this.source = source
    return this
  }

  public addValidationPipeline (
    validationName: string,
    validationFn: ValidationTestFn
  ): void {
    this.validationPipeline.push({ validationName, validationFn })
  }

  for (validationFn: ValidationFunction): ArrayValidationBuilder {
    validationFn(new ArrayValidationStage(this))
    return this
  }

  public build (): ValidationError | null {
    const errors: ValidationError = {}

    this.validationPipeline.forEach(({ validationFn, validationName }) => {
      this.getSource().forEach((item, idx) => {
        let hasError = false
        const result = validationFn(item)
        const resultIsObject = typeof result === 'object' && result && Object.keys(result).length

        if (result === false) {
          hasError = true
        } else if (resultIsObject) {
          hasError = true
        }

        if (hasError) {
          if (result === false) {
            errors[idx] ||= []
            errors[idx].push(validationName)
          } else if (resultIsObject) {
            const [firstError] = Object.keys(result)
            const [validationError] = result[firstError]
            const concatKey = `${idx}.${firstError}`

            errors[concatKey] ||= []
            errors[concatKey].push(validationError)
          }
        }
      })
    })

    return Object.keys(errors).length ? errors : null
  }
}
