import { ValidationOptions, ValidationTestFn } from '@/interfaces'
import { ArrayValidationBuilder } from '@/builders'

export class ArrayValidationStage {
  constructor (protected readonly builder: ArrayValidationBuilder) {}

  isNotEmpty (opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'isNotEmpty',
      (val: any[]) => !!val.length,
      opts
    )
    return this
  }

  includes (value: any, opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline('includes', (val: any[]) =>
      val.includes(value),
      opts
    )
    return this
  }

  includesAll (values: any[], opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline('includesAll', (val: any[]) =>
      values.every((value) => val.includes(value)),
      opts
    )
    return this
  }

  every (callbackFn: (val: any) => boolean, opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline('every', (val: any[]) =>
      val.every(callbackFn),
      opts
    )
    return this
  }

  some (callbackFn: ValidationTestFn, opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline('some', (val: any[]) =>
      val.some(callbackFn),
      opts
    )
    return this
  }

  length (length: number, opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'length',
      (val: string) => val.length === length,
      opts
    )

    return this
  }

  minLength (min: number, opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'minLength',
      (val: string | any[]) => val.length >= min,
      opts
    )
    return this
  }

  maxLength (max: number, opts?: ValidationOptions): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'maxLength',
      (val: string | any[]) => val.length <= max,
      opts
    )
    return this
  }
}
