import { ValidationError, ValidationOptions } from '@/interfaces'
import { ValidationBuilder } from '@/core/builders/validation-builder'

export type ValidationTestFn = (val: any) => ValidationBuilder | ValidationError | boolean | null

export interface ValidationStageDescriptor {
  validationName: string
  validationFn: ValidationTestFn
  opts?: ValidationOptions
}
