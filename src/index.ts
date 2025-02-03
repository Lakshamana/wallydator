import { ObjectValidator } from './core/validators/object-validator'
import { ArrayValidator } from './core/validators/array-validator'
import { ArrayValidationBuilder, ObjectValidationBuilder } from './core/builders'

export { Validator } from './core/abstract/validation-builder'

export class Wallydator {
  static from(source: Object): ObjectValidationBuilder {
    return new ObjectValidationBuilder(new ObjectValidator()).from(source)
  }

  static fromArray(source: any[]): ArrayValidationBuilder {
    return new ArrayValidationBuilder(new ArrayValidator()).from(source)
  }
}
