import { ObjectValidator } from '@/core/validators/object-validator'
import { ValidationBuilder } from './validation-builder'
import { ValidationStage } from '@/core/stages'

export class ObjectValidationBuilder extends ValidationBuilder {
  constructor(private readonly validator: ObjectValidator) {
    super()
  }

  from(source: Object): ObjectValidationBuilder {
    this.validator.from(source)
    return this
  }

  field(
    fieldName: string,
    validationFn: (validator: ValidationStage) => ValidationStage,
  ): ObjectValidationBuilder {
    this.validator.field(fieldName, validationFn)
    return this
  }

  build() {
    return this.validator.build()
  }
}
