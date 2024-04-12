import { ValidationBuilder } from '@/builders/abstract'
import { ValidationError } from '@/interfaces'
import { ValidationBuilderWrapper } from '@/types'
import { Wallydator } from '..'

const source = {
  name: 'John Doex',
  age: 16,
  hasParentsPermission: true,
  email: 'john.doe@email.com',
  notEqualsThis: 'a-value',
  arrayField: [],
  nested: {
    data: 'nested data',
    nested2: {
      data2: 'more nested data'
    }
  }
}

const validationFn = (src: Object): ValidationBuilder => {
  return Wallydator.from(src)
    .field('name', (v) => v.isString().required().equals('John Doe'))
    .field('age', (v) => v.required().isNumber())
    .field('email', (v) => v.isString().required().email())
    .field('hasParentsPermission', (v) =>
      v
        .requiredIf('age', (age) => age < 18)
        .isBoolean()
        .equals(true)
    )
    .field('nested', (v) =>
      v.isObject().validateNested((nested, $parent) =>
        nested
          .field('data', (vv) => vv.isString().required())
          .field('dataRequiredIf', (vv) =>
            vv
              .requiredIf('name', (name) => name === 'John Doe', $parent)
              .isString()
          )
          .field('nested2', (vv) =>
            vv
              .isObject()
              .validateNested((nested2) =>
                nested2.field('dataError', (vvv) => vvv.required()).build()
              )
          )
          .build()
      )
    )
    .field('notEqualsThis', (v) => v.notEquals('a-value'))
    .field('arrayField', (v) =>
      v
        .isArray()
        .required()
        .minLength(1)
        .validateArray((array) => array.for((item) => item.min(3)).build())
    )
}

function checkValidation (
  src: Object,
  validationWrapper: ValidationBuilderWrapper
): ValidationError | null {
  return validationWrapper(src).build()
}

const arraySource = [1, 2, 3, 4, 5]
const arrayValidation = Wallydator.fromArray(arraySource)
  .for((item) => item.isNumber().equals(3))
  .build()

const withArrayObject = {
  items: [
    { name: 'John Doe', age: 18 },
    { name: 'Jane Doe', age: 16 }
  ]
}

const arrayWithObjectsValidation = Wallydator.from(withArrayObject)
  .field('items', (v) =>
    v
      .isArray()
      .required()
      .validateArray((array) =>
        array
          .for((item) =>
            item
              .isObject()
              .required()
              .validateNested((builder) =>
                builder
                  .field('name', (v) => v.isString().required())
                  .field('age', (v) => v.isNumber().min(18))
                  .build()
              )
          )
          .build()
      )
  )
  .build()

console.error(checkValidation(source, validationFn))
console.error(arrayValidation)
console.error(arrayWithObjectsValidation)
