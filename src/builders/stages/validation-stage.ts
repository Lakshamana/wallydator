import { ValidationBuilder } from '@/builders/abstract'
import { ArrayValidationBuilder, ObjectValidationBuilder } from '@/builders'
import { ValidationError } from '@/interfaces'

export class ValidationStage {
  constructor(protected readonly builder: ValidationBuilder) {}

  private checkUndefined(val: any): boolean {
    return val === undefined
  }

  isString(): ValidationStage {
    this.builder.addValidationPipeline(
      'isString',
      (val: any) => this.checkUndefined(val) || typeof val === 'string',
    )
    return this
  }

  isNumber(): ValidationStage {
    this.builder.addValidationPipeline(
      'isNumber',
      (val: any) => this.checkUndefined(val) || typeof val === 'number',
    )
    return this
  }

  isInteger(): ValidationStage {
    this.builder.addValidationPipeline(
      'isInteger',
      (val: any) => this.checkUndefined(val) || (!isNaN(val) && Number.isInteger(val)),
    )
    return this
  }

  isNumeric(): ValidationStage {
    this.builder.addValidationPipeline('isNumeric', isNaN)
    return this
  }

  isBoolean(): ValidationStage {
    this.builder.addValidationPipeline(
      'isBoolean',
      (val: any) => this.checkUndefined(val) || typeof val === 'boolean',
    )
    return this
  }

  isObject(): ValidationStage {
    this.builder.addValidationPipeline(
      'isObject',
      (val: any) =>
        this.checkUndefined(val) ||
        (typeof val === 'object' && !Array.isArray(val) && val !== null),
    )
    return this
  }

  isArray(): ValidationStage {
    this.builder.addValidationPipeline(
      'isArray',
      (val: any) => this.checkUndefined(val) || (typeof val === 'object' && Array.isArray(val)),
    )
    return this
  }

  isDate(): ValidationStage {
    this.builder.addValidationPipeline(
      'date',
      (val: any) => this.checkUndefined(val) || !!new Date(val).getDay,
    )
    return this
  }

  required(): ValidationStage {
    this.builder.addValidationPipeline(
      'required',
      (val: any) => !['', null, undefined].includes(val),
    )
    return this
  }

  requiredIf(
    field: string,
    callbackFn: (value: any) => boolean,
    base?: ValidationBuilder,
  ): ValidationStage {
    const useBase = base ?? this.builder

    this.builder.addValidationPipeline(
      'requiredIf',
      (val: any) => !callbackFn(useBase.getSource()[field]) || !['', null, undefined].includes(val),
    )
    return this
  }

  equals(equalsValue: any): ValidationStage {
    this.builder.addValidationPipeline('equals', (val: any) =>
      [equalsValue, undefined].includes(val),
    )
    return this
  }

  notEquals(value: any): ValidationStage {
    this.builder.addValidationPipeline('notEquals', (val: any) => val !== value)
    return this
  }

  isNotEmpty(): ValidationStage {
    this.builder.addValidationPipeline('isNotEmpty', (val: object | Array<any> | string) => {
      if (this.checkUndefined(val)) {
        return true
      }

      if (Array.isArray(val)) {
        return !val.length
      }

      if (typeof val === 'object') {
        return !!Object.keys(val)?.length
      }

      return val === ''
    })
    return this
  }

  min(minValue: number): ValidationStage {
    this.builder.addValidationPipeline(
      'min',
      (val: number) => this.checkUndefined(val) || val >= minValue,
    )
    return this
  }

  max(maxValue: number): ValidationStage {
    this.builder.addValidationPipeline(
      'max',
      (val: number) => this.checkUndefined(val) || val <= maxValue,
    )
    return this
  }

  length(length: number): ValidationStage {
    this.builder.addValidationPipeline(
      'length',
      (val: string) => this.checkUndefined(val) || val.length === length,
    )
    return this
  }

  minLength(min: number): ValidationStage {
    this.builder.addValidationPipeline(
      'minLength',
      (val: string) => this.checkUndefined(val) || val.length >= min,
    )
    return this
  }

  maxLength(max: number): ValidationStage {
    this.builder.addValidationPipeline(
      'maxLength',
      (val: string) => this.checkUndefined(val) || val.length <= max,
    )
    return this
  }

  regex(pattern: RegExp): ValidationStage {
    this.builder.addValidationPipeline(
      'regex',
      (val: string) => this.checkUndefined(val) || pattern.test(val),
    )
    return this
  }

  email(): ValidationStage {
    this.builder.addValidationPipeline(
      'email',
      (val: string) =>
        this.checkUndefined(val) ||
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          String(val).toLowerCase(),
        ),
    )
    return this
  }

  custom(callbackFn: (val: any, $source: any) => boolean): ValidationStage {
    this.builder.addValidationPipeline(
      'custom',
      val => this.checkUndefined(val) || callbackFn(val, this.builder.getSource()),
    )
    return this
  }

  compareToField(
    field: string,
    callbackFn: (val: any, [field]: any) => boolean,
    label?: string,
  ): ValidationStage {
    const compareAgainstValue = this.builder.getSource()[field]
    this.builder.addValidationPipeline(
      `compareToField:${label ?? field}`,
      (val: any) =>
        this.checkUndefined(val) ||
        this.checkUndefined(compareAgainstValue) ||
        callbackFn(val, compareAgainstValue),
    )
    return this
  }

  validateNested(
    callbackFn: (
      builder: ObjectValidationBuilder,
      parent: ValidationBuilder,
    ) => ValidationBuilder | ValidationError | null,
  ): ValidationStage {
    this.builder.addValidationPipeline(
      'validateNested',
      (val: Object) =>
        this.checkUndefined(val) ||
        callbackFn(new ObjectValidationBuilder().from(val), this.builder),
    )
    return this
  }

  validateArray(
    callbackFn: (
      builder: ArrayValidationBuilder,
      parent?: ValidationBuilder | ArrayValidationBuilder,
    ) => ValidationBuilder | ValidationError | null,
  ): ValidationStage {
    this.builder.addValidationPipeline(
      'validateArray',
      (val: any[]) =>
        this.checkUndefined(val) ||
        callbackFn(new ArrayValidationBuilder().from(val), this.builder),
    )
    return this
  }
}
