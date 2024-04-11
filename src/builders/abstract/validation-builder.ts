import { ValidationError, ValidationTestFn } from '@/interfaces'

export abstract class ValidationBuilder {
  protected source: any | any[] = null

  public abstract addValidationPipeline (validationName: string, validationFn: ValidationTestFn): void

  public abstract build (): ValidationError | null

  public getSource (): any | any[] {
    return this.source
  }
}
