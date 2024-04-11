import { ValidationStage } from '@/builders/stages'
import { ValidationTestFn } from '@/interfaces'

export class ArrayValidationStage extends ValidationStage {
  notEmptyArray (): ArrayValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline(
      'notEmpty',
      (val: any[]) => !!val.length
    )
    return this
  }

  includes (value: any): ArrayValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('includes', (val: any[]) =>
      val.includes(value)
    )
    return this
  }

  includesAll (values: any[]): ArrayValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('includesAll', (val: any[]) =>
      values.every((value) => val.includes(value))
    )
    return this
  }

  every (callbackFn: (val: any) => boolean): ArrayValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('every', (val: any[]) =>
      val.every(callbackFn)
    )
    return this
  }

  some (callbackFn: ValidationTestFn): ArrayValidationStage {
    this.checkSource()
    this.builder.addValidationPipeline('some', (val: any[]) =>
      val.some(callbackFn)
    )
    return this
  }
}
