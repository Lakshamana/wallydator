import { ValidationStage } from '@/builders/stages'

describe('ValidationStage', () => {
  let builder: any
  let validationStage: any

  beforeEach(() => {
    builder = {
      addValidationPipeline: jest.fn(),
      getSource: jest.fn(() => ({})),
    }
    validationStage = new ValidationStage(builder)
  })

  test('isString should add correct validation', () => {
    validationStage.isString()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isString',
      expect.any(Function),
      undefined,
    )
  })

  test('isNumber should add correct validation', () => {
    validationStage.isNumber()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isNumber',
      expect.any(Function),
      undefined,
    )
  })

  test('isInteger should add correct validation', () => {
    validationStage.isInteger()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isInteger',
      expect.any(Function),
      undefined,
    )
  })

  test('isNumeric should add correct validation', () => {
    validationStage.isNumeric()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isNumeric',
      expect.any(Function),
      undefined,
    )
  })

  test('isBoolean should add correct validation', () => {
    validationStage.isBoolean()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isBoolean',
      expect.any(Function),
      undefined,
    )
  })

  test('isObject should add correct validation', () => {
    validationStage.isObject()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isObject',
      expect.any(Function),
      undefined,
    )
  })

  test('isArray should add correct validation', () => {
    validationStage.isArray()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isArray',
      expect.any(Function),
      undefined,
    )
  })

  test('isDate should add correct validation', () => {
    validationStage.isDate()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isDate',
      expect.any(Function),
      undefined,
    )
  })

  test('required should add correct validation', () => {
    validationStage.required()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'required',
      expect.any(Function),
      undefined,
    )
  })

  test('requiredIf should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.requiredIf('someField', callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'requiredIf',
      expect.any(Function),
      undefined,
    )
  })

  test('equals should add correct validation', () => {
    validationStage.equals('test')
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'equals',
      expect.any(Function),
      undefined,
    )
  })

  test('notEquals should add correct validation', () => {
    validationStage.notEquals('test')
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'notEquals',
      expect.any(Function),
      undefined,
    )
  })

  test('isNotEmpty should add correct validation', () => {
    validationStage.isNotEmpty()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'isNotEmpty',
      expect.any(Function),
      undefined,
    )
  })

  test('min should add correct validation', () => {
    validationStage.min(10)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'min',
      expect.any(Function),
      undefined,
    )
  })

  test('max should add correct validation', () => {
    validationStage.max(10)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'max',
      expect.any(Function),
      undefined,
    )
  })

  test('length should add correct validation', () => {
    validationStage.length(5)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'length',
      expect.any(Function),
      undefined,
    )
  })

  test('minLength should add correct validation', () => {
    validationStage.minLength(5)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'minLength',
      expect.any(Function),
      undefined,
    )
  })

  test('maxLength should add correct validation', () => {
    validationStage.maxLength(10)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'maxLength',
      expect.any(Function),
      undefined,
    )
  })

  test('regex should add correct validation', () => {
    const pattern = /test/
    validationStage.regex(pattern)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'regex',
      expect.any(Function),
      undefined,
    )
  })

  test('email should add correct validation', () => {
    validationStage.email()
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'email',
      expect.any(Function),
      undefined,
    )
  })

  test('custom should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.custom(callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'custom',
      expect.any(Function),
      undefined,
    )
  })

  test('compareToField should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.compareToField('field', callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'compareToField:field',
      expect.any(Function),
      undefined,
    )
  })

  test('validateNested should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.validateNested(callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'validateNested',
      expect.any(Function),
      undefined,
    )
  })

  test('validateArray should add correct validation', () => {
    const callbackFn = jest.fn()
    validationStage.validateArray(callbackFn)
    expect(builder.addValidationPipeline).toHaveBeenCalledWith(
      'validateArray',
      expect.any(Function),
      undefined,
    )
  })
})
