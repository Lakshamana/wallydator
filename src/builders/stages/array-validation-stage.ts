import { ValidationTestFn } from '@/interfaces'
import { ArrayValidationBuilder } from '@/builders'

export class ArrayValidationStage {
  constructor (protected readonly builder: ArrayValidationBuilder) {}

  notEmptyArray (): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'notEmpty',
      (val: any[]) => !!val.length
    )
    return this
  }

  includes (value: any): ArrayValidationStage {
    this.builder.addRootValidationPipeline('includes', (val: any[]) =>
      val.includes(value)
    )
    return this
  }

  includesAll (values: any[]): ArrayValidationStage {
    this.builder.addRootValidationPipeline('includesAll', (val: any[]) =>
      values.every((value) => val.includes(value))
    )
    return this
  }

  every (callbackFn: (val: any) => boolean): ArrayValidationStage {
    this.builder.addRootValidationPipeline('every', (val: any[]) =>
      val.every(callbackFn)
    )
    return this
  }

  some (callbackFn: ValidationTestFn): ArrayValidationStage {
    this.builder.addRootValidationPipeline('some', (val: any[]) =>
      val.some(callbackFn)
    )
    return this
  }

  length (length: number): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'length',
      (val: string) => val.length === length
    )

    return this
  }

  minLength (min: number): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'minLength',
      (val: string | any[]) => val.length >= min
    )
    return this
  }

  maxLength (max: number): ArrayValidationStage {
    this.builder.addRootValidationPipeline(
      'maxLength',
      (val: string | any[]) => val.length <= max
    )
    return this
  }
}
