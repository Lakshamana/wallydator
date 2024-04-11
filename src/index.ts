/* eslint-disable @typescript-eslint/no-extraneous-class */
import './config/module-alias'
import { ArrayValidationBuilder, ObjectValidationBuilder } from './builders'

export { ValidationBuilder } from './builders/abstract/validation-builder'

export class Wallydator {
  static from (source: Object): ObjectValidationBuilder {
    return new ObjectValidationBuilder().from(source)
  }

  static fromArray (source: any[]): ArrayValidationBuilder {
    return new ArrayValidationBuilder().from(source)
  }
}
