import { ArrayValidationBuilder } from '@/builders'
import { ArrayValidationFunction, ValidationFunction } from '@/types'
import { ValidationError } from './validation-error'

export interface ArrayValidationBuilderContract {
  from: (source?: any[]) => ArrayValidationBuilder
  root: (validationFn: ArrayValidationFunction) => ArrayValidationBuilder
  for: (validationFn: ValidationFunction) => ArrayValidationBuilder
  build: () => ValidationError | null
}
