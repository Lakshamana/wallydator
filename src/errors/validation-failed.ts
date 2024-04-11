export class ValidationFailed extends Error {
  constructor (fieldName: string, issuer: string) {
    super(`Validation failed for field ${fieldName} on ${issuer} step`)
    this.name = 'ValidationFailed'
  }
}
