import { ValidationError, ValidationOptions, ValidationTestFn } from '@/interfaces'

export abstract class Validator {
  protected source: any | any[] = null

  public abstract addValidationPipeline(
    validationName: string,
    validationFn: ValidationTestFn,
    opts?: ValidationOptions,
  ): void

  public abstract build(): ValidationError | null

  public getSource(): any | any[] {
    return this.source
  }
}
