import { ValidationStage } from '@/builders/stages'

describe('ValidationStage', () => {
  let builder: any
  let validationStage: any

  beforeEach(() => {
    builder = {
      addValidationPipeline: jest.fn(),
      getSource: jest.fn(() => ({}))
    }
    validationStage = new ValidationStage(builder)
  })

  test('isString should add correct validation', () => {
    validationStage.isString()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isString',
      expect.any(Function)
    )
  })

  test('isNumber should add correct validation', () => {
    validationStage.isNumber()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isNumber',
      expect.any(Function)
    )
  })

  test('isInteger should add correct validation', () => {
    validationStage.isInteger()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isInteger',
      expect.any(Function)
    )
  })

  test('isNumeric should add correct validation', () => {
    validationStage.isNumeric()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isNumeric',
      expect.any(Function)
    )
  })

  test('isBoolean should add correct validation', () => {
    validationStage.isBoolean()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isBoolean',
      expect.any(Function)
    )
  })

  test('isObject should add correct validation', () => {
    validationStage.isObject()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isObject',
      expect.any(Function)
    )
  })

  test('isArray should add correct validation', () => {
    validationStage.isArray()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isArray',
      expect.any(Function)
    )
  })

  test('isDate should add correct validation', () => {
    validationStage.isDate()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'date',
      expect.any(Function)
    )
  })

  test('required should add correct validation', () => {
    validationStage.required()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'required',
      expect.any(Function)
    )
  })

  test('requiredIf should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.requiredIf('someField', callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'requiredIf',
      expect.any(Function)
    )
  })

  test('equals should add correct validation', () => {
    validationStage.equals('test')
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'equals',
      expect.any(Function)
    )
  })

  test('notEquals should add correct validation', () => {
    validationStage.notEquals('test')
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'notEquals',
      expect.any(Function)
    )
  })

  test('notEmptyObject should add correct validation', () => {
    validationStage.notEmptyObject()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'notEmpty',
      expect.any(Function)
    )
  })

  test('min should add correct validation', () => {
    validationStage.min(10)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'min',
      expect.any(Function)
    )
  })

  test('max should add correct validation', () => {
    validationStage.max(10)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'max',
      expect.any(Function)
    )
  })

  test('length should add correct validation', () => {
    validationStage.length(5)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'length',
      expect.any(Function)
    )
  })

  test('minLength should add correct validation', () => {
    validationStage.minLength(5)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'minLength',
      expect.any(Function)
    )
  })

  test('maxLength should add correct validation', () => {
    validationStage.maxLength(10)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'maxLength',
      expect.any(Function)
    )
  })

  test('regex should add correct validation', () => {
    const pattern = /test/
    validationStage.regex(pattern)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'regex',
      expect.any(Function)
    )
  })

  test('email should add correct validation', () => {
    validationStage.email()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'email',
      expect.any(Function)
    )
  })

  test('custom should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.custom(callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'custom',
      expect.any(Function)
    )
  })

  test('compareToField should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.compareToField('field', callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'compareToField:field',
      expect.any(Function)
    )
  })

  test('validateNested should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.validateNested(callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'validateNested',
      expect.any(Function)
    )
  })

  test('validateArray should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.validateArray(callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'validateArray',
      expect.any(Function)
    )
  })
})
