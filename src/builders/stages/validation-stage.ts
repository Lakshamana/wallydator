import { ValidationBuilder } from '@/builders/abstract'
import { ArrayValidationBuilder, ObjectValidationBuilder } from '@/builders'
import { NoSourceDefined } from '@/errors'
import { ValidationError } from '@/interfaces'

export class ValidationStage {
  constructor (protected readonly builder: ValidationBuilder) {}

  protected checkSource (): void {
    if (!this.builder.getSource()) throw new NoSourceDefined()
  }

  isString (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'isString',
      (val: any) => typeof val === 'string'
    )
    return this
  }

  isNumber (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'isNumber',
      (val: any) => typeof val === 'number'
    )
    return this
  }

  isInteger (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'isInteger',
      (val: number) => !isNaN(val) && Number.isInteger(val)
    )
    return this
  }

  isNumeric (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('isNumeric', isNaN)
    return this
  }

  isBoolean (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'isBoolean',
      (val: any) => typeof val === 'boolean'
    )
    return this
  }

  isObject (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'isObject',
      (val: any) =>
        typeof val === 'object' && !Array.isArray(val) && val !== null
    )
    return this
  }

  isArray (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'isArray',
      (val: any) => typeof val === 'object' && Array.isArray(val)
    )
    return this
  }

  isDate (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'date',
      (val: any) => !!new Date(val).getDay
    )
    return this
  }

  required (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'required',
      (val: any) => !['', null, undefined].includes(val)
    )
    return this
  }

  requiredIf (
    field: string,
    callbackFn: (value: any) => boolean,
    base?: ValidationBuilder
  ): ValidationStage {
    this.checkSource()
    const useBase = base ?? this.builder

    this.builder.addValidationPipeline(
      'requiredIf',
      (val: any) =>
        !callbackFn(useBase.getSource()[field]) ||
        !['', null, undefined].includes(val)
    )
    return this
  }

  equals (equalsValue: any): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'equals',
      (val: any) => val === equalsValue
    )
    return this
  }

  notEquals (value: any): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'notEquals',
      (val: any) => val !== value
    )
    return this
  }

  notEmptyObject (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'notEmpty',
      (val: Object) => !!Object.keys(val).keys
    )
    return this
  }

  min (minValue: number): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('min', (val: number) => val >= minValue)
    return this
  }

  max (maxValue: number): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('max', (val: number) => val <= maxValue)
    return this
  }

  length (length: number): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'length',
      (val: string) => val.length === length
    )
    return this
  }

  minLength (min: number): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'minLength',
      (val: string | any[]) => val.length >= min
    )
    return this
  }

  maxLength (max: number): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'maxLength',
      (val: string | any[]) => val.length <= max
    )
    return this
  }

  regex (pattern: RegExp): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('regex', pattern.test)
    return this
  }

  email (): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('email', (val: string) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(val).toLowerCase()
      )
    )
    return this
  }

  custom (callbackFn: (val: any) => boolean): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('custom', callbackFn)
    return this
  }

  validateNested (
    callbackFn: (
      builder: ObjectValidationBuilder,
      parent: ValidationBuilder,
    ) => ValidationError | null
  ): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('validateNested', (val: Object) =>
      callbackFn(new ObjectValidationBuilder().from(val), this.builder)
    )
    return this
  }

  validateArray (
    callbackFn: (
      builder: ArrayValidationBuilder,
      parent?: ValidationBuilder | ArrayValidationBuilder,
    ) => ValidationError | null
  ): ValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('for', (val: any[]) =>
      callbackFn(new ArrayValidationBuilder().from(val), this.builder)
    )
    return this
  }
}
