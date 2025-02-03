import { ArrayValidator } from '@/core/validators'
import { ArrayValidationStage, ValidationStage } from '@/core/stages'
import { ValidationBuilder } from './validation-builder'

export class ArrayValidationBuilder extends ValidationBuilder {
  constructor(private readonly validator: ArrayValidator) {
    super()
  }

  from(source: Array<any>): ArrayValidationBuilder {
    this.validator.from(source)
    return this
  }

  root(
    validationFn: (validator: ArrayValidationStage) => ArrayValidationStage,
  ): ArrayValidationBuilder {
    this.validator.root(validationFn)
    return this
  }

  for(validationFn: (validator: ValidationStage) => ValidationStage): ArrayValidationBuilder {
    this.validator.for(validationFn)
    return this
  }

  build() {
    return this.validator.build()
  }
}
