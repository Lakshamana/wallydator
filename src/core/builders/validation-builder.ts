import { ValidationError } from '@/interfaces'

export abstract class ValidationBuilder {
  abstract build(): ValidationError | null
}
