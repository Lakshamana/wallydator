export class NoSourceDefined extends Error {
  constructor () {
    super('Use `from` or `fromArray` methods to define a source before proceeding to validation')
    this.name = 'NoSourceDefined'
  }
}
