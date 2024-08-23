import { ObjectValidationBuilder } from '@/builders'
import { ValidationFunction } from '@/types'
import { ValidationError } from './validation-error'

export interface ObjectValidationBuilderContract {
  from: (source: Object) => ObjectValidationBuilder
  field: (
    fieldName: string,
    validationFn: ValidationFunction,
  ) => ObjectValidationBuilder
  build: () => ValidationError | null
}
