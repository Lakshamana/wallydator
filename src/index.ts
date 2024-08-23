/* eslint-disable @typescript-eslint/no-extraneous-class */
import './config/module-alias'
import { ArrayValidationBuilder, ObjectValidationBuilder } from './builders'
import {
  ArrayValidationBuilderContract,
  ObjectValidationBuilderContract
} from './interfaces'

export { ValidationBuilder } from './builders/abstract/validation-builder'
export { ValidationBuilderWrapper } from './types'

export class Wallydator {
  static from (
    source: Object
  ): ObjectValidationBuilderContract {
    return new ObjectValidationBuilder().from(source)
  }

  static fromArray (
    source: any[]
  ): ArrayValidationBuilderContract {
    return new ArrayValidationBuilder().from(source)
  }
}
