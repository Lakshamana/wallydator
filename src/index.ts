import { ArrayValidationBuilder, ObjectValidationBuilder } from './builders'

export { ValidationBuilder } from './builders/abstract/validation-builder'
export { type ValidationBuilderWrapper } from './types'

export class Wallydator {
  static from (
    source: Object
  ): ObjectValidationBuilder {
    return new ObjectValidationBuilder().from(source)
  }

  static fromArray (
    source: any[]
  ): ArrayValidationBuilder {
    return new ArrayValidationBuilder().from(source)
  }
}
