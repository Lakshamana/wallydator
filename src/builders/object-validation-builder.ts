import { ValidationFunction } from '@/types'
import { ValidationBuilder } from '@/builders/abstract'
import { ValidationError, ValidationStageDescriptor, ValidationTestFn } from '@/interfaces'
import { NoSourceDefined } from '@/errors'
import { ValidationStage } from './stages'

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

  public getCurrentValue (): any {
    return this.source[this.fieldName]
  }

  build (): ValidationError | null {
    if (!this.source) {
      throw new NoSourceDefined()
    }

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
            Object.keys(result).forEach(errorKey => {
              const errorList = result[errorKey]
              const concatKey = `${key}.${errorKey}`.replace(/(.*)\.$/g, '$1')

              errors[concatKey] ||= []
              errors[concatKey].push(...errorList)
            })
          }
        }
      }
    })

    const filteredErrors = Object.keys(errors).reduce((acc, k) => ({
      ...acc,
      [k.endsWith('.$root') ? k.replace('.$root', '') : k]: errors[k]
    }), {})

    return Object.keys(filteredErrors).length ? filteredErrors : null
  }
}
