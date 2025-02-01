import { ValidationError, ValidationOptions } from '@/interfaces'
import { ValidationBuilder } from '@/builders/abstract'

export type ValidationTestFn = (val: any) => ValidationBuilder | ValidationError | boolean | null

export type ValidationStageDescriptor = {
  validationName: string
  validationFn: ValidationTestFn
  opts?: ValidationOptions
}
