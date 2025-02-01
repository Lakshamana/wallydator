import { ValidationBuilder } from '@/builders/abstract'
import { ArrayValidationBuilder, ObjectValidationBuilder } from '@/builders'
import { ValidationError, ValidationOptions } from '@/interfaces'

export class ValidationStage {
  constructor(protected readonly builder: ValidationBuilder) {}

  private checkUndefined(val: any): boolean {
    return val === undefined
  }

  isString(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isString',
      (val: any) => this.checkUndefined(val) || typeof val === 'string',
      opts,
    )
    return this
  }

  isNumber(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isNumber',
      (val: any) => this.checkUndefined(val) || typeof val === 'number',
      opts,
    )
    return this
  }

  isInteger(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isInteger',
      (val: any) => this.checkUndefined(val) || (!isNaN(val) && Number.isInteger(val)),
      opts,
    )
    return this
  }

  isNumeric(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline('isNumeric', isNaN, opts)
    return this
  }

  isBoolean(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isBoolean',
      (val: any) => this.checkUndefined(val) || typeof val === 'boolean',
      opts,
    )
    return this
  }

  isObject(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isObject',
      (val: any) =>
        this.checkUndefined(val) ||
        (typeof val === 'object' && !Array.isArray(val) && val !== null),
      opts,
    )
    return this
  }

  isArray(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isArray',
      (val: any) => this.checkUndefined(val) || (typeof val === 'object' && Array.isArray(val)),
      opts,
    )
    return this
  }

  isDate(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isDate',
      (val: Date) => this.checkUndefined(val) || !!val.getDay,
      opts,
    )
    return this
  }

  required(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'required',
      (val: any) => !['', null, undefined].includes(val),
      opts,
    )
    return this
  }

  requiredIf(
    field: string,
    callbackFn: (value: any) => boolean,
    opts?: ValidationOptions,
  ): ValidationStage {
    this.builder.addValidationPipeline(
      'requiredIf',
      (val: any) =>
        !callbackFn(this.builder.getSource()[field]) || !['', null, undefined].includes(val),
      opts,
    )
    return this
  }

  equals(equalsValue: any, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'equals',
      (val: any) => [equalsValue, undefined].includes(val),
      opts,
    )
    return this
  }

  notEquals(value: any, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline('notEquals', (val: any) => val !== value, opts)
    return this
  }

  isNotEmpty(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'isNotEmpty',
      (val: object | Array<any> | string) => {
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
      },
      opts,
    )
    return this
  }

  min(minValue: number | Date, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'min',
      (val: number | Date) => this.checkUndefined(val) || val >= minValue,
      opts
    )
    return this
  }

  max(maxValue: number | Date, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'max',
      (val: number | Date) => this.checkUndefined(val) || val <= maxValue,
      opts
    )
    return this
  }

  length(length: number, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'length',
      (val: string) => this.checkUndefined(val) || val.length === length,
      opts
    )
    return this
  }

  minLength(min: number, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'minLength',
      (val: string) => this.checkUndefined(val) || val.length >= min,
      opts
    )
    return this
  }

  maxLength(max: number, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'maxLength',
      (val: string) => this.checkUndefined(val) || val.length <= max,
      opts
    )
    return this
  }

  regex(pattern: RegExp, opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'regex',
      (val: string) => this.checkUndefined(val) || pattern.test(val),
      opts
    )
    return this
  }

  email(opts?: ValidationOptions): ValidationStage {
    this.builder.addValidationPipeline(
      'email',
      (val: string) =>
        this.checkUndefined(val) ||
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          String(val).toLowerCase(),
        ),
      opts
    )
    return this
  }

  custom(
    callbackFn: (val: any, $source: any) => boolean,
    label: string = '',
    opts?: ValidationOptions,
  ): ValidationStage {
    const useLabel = label ? `custom:${label}` : 'custom'
    this.builder.addValidationPipeline(
      useLabel,
      val => this.checkUndefined(val) || callbackFn(val, this.builder.getSource()),
      opts
    )
    return this
  }

  compareToField(
    field: string,
    callbackFn: (val: any, [field]: any) => boolean,
    label?: string,
    opts?: ValidationOptions,
  ): ValidationStage {
    const compareAgainstValue = this.builder.getSource()[field]
    this.builder.addValidationPipeline(
      `compareToField:${label ?? field}`,
      (val: any) =>
        this.checkUndefined(val) ||
        this.checkUndefined(compareAgainstValue) ||
        callbackFn(val, compareAgainstValue),
      opts
    )
    return this
  }

  validateNested(
    callbackFn: (
      builder: ObjectValidationBuilder,
      parent: any,
    ) => ValidationBuilder | ValidationError | null,
    opts?: ValidationOptions,
  ): ValidationStage {
    this.builder.addValidationPipeline(
      'validateNested',
      (val: Object) =>
        this.checkUndefined(val) ||
        callbackFn(new ObjectValidationBuilder().from(val), this.builder.getSource()),
      opts,
    )
    return this
  }

  validateArray(
    callbackFn: (
      builder: ArrayValidationBuilder,
      parent?: any[],
    ) => ValidationBuilder | ValidationError | null,
    opts?: ValidationOptions,
  ): ValidationStage {
    this.builder.addValidationPipeline(
      'validateArray',
      (val: any[]) =>
        this.checkUndefined(val) ||
        callbackFn(new ArrayValidationBuilder().from(val), this.builder.getSource() as any[]),
      opts,
    )
    return this
  }
}
