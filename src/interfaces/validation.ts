import { ValidationError } from '@/interfaces'

export type ValidationTestFn = (val: any) => ValidationError | boolean | null

export type ValidationStageDescriptor = {
  validationName: string
  validationFn: ValidationTestFn
}
