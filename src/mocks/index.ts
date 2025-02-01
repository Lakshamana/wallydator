import { ObjectValidationBuilderContract, ValidationError } from '@/interfaces'
import { ValidationBuilderWrapper } from '@/types'
import { Wallydator } from '..'

const source = {
  name: 'John Doex',
  age: 16,
  hasParentsPermission: false,
  email: 'john.doe@email.com',
  notEqualsThis: 'a-value',
  arrayField: [],
  nested: {
    data: 'nested data',
    dataRequiredIf: 1,
    nested2: {
      data2: 'more nested data',
    },
  },
}

const validationFn = (src: Object): ObjectValidationBuilderContract => {
  return Wallydator.from(src)
    .field('name', v => v.isString().required().equals('John Doe'))
    .field('age', v => v.required().isNumber())
    .field('email', v => v.isString().required().email())
    .field('hasParentsPermission', v =>
      v
        .requiredIf('age', age => age < 18)
        .isBoolean()
        .equals(true, { message: 'should have parents permission' }),
    )
    .field('nested', v =>
      v.isObject().validateNested((nested, $parent) =>
        nested
          .field('data', vv => vv.isString().required())
          .field('dataRequiredIf', vv =>
            vv
              .requiredIf('data', data => data === 'nested data' && $parent.name === 'John Doex', {
                message: 'error message here...',
              })
              .isString(),
          )
          .field('nested2', vv =>
            vv
              .isObject()
              .validateNested(nested2 => nested2.field('dataError', vvv => vvv.required())),
          ),
      ),
    )
    .field('notEqualsThis', v => v.notEquals('a-value'))
    .field('arrayField', v =>
      v
        .isArray()
        .required()
        .minLength(1)
        .validateArray(array => array.for(item => item.min(3))),
    )
}

function checkValidation(
  src: Object,
  validationWrapper: ValidationBuilderWrapper,
): ValidationError | null {
  return validationWrapper(src).build()
}

const arraySource: any[] = [0, 1, 2, 3, 4]
const arrayValidation = Wallydator.fromArray(arraySource)
  .root(r => r.minLength(10))
  .for(item => item.isNumber().required().max(3))
  .build()

const withArrayObject = {
  items: [
    {
      name: 'John Doe',
      age: 18,
      country: 'USA',
      stateCount: 50,
      startDate: new Date('2017-02-01 00:00:00'),
      endDate: new Date('2017-02-01 00:00:00'),
    },
    {
      name: 'Jane Doe',
      age: 16,
      country: 'BRA',
      stateCount: 27,
      startDate: undefined,
      endDate: new Date('2017-03-01 00:00:00'),
    },
  ],
}

const arrayWithObjectsValidation = Wallydator.from(withArrayObject)
  .field('items', v =>
    v.isArray().validateArray(array =>
      array
        .root(r => r.maxLength(2))
        .for(item =>
          item
            .isObject()
            .required()
            .validateNested(builder =>
              builder
                .field('name', v => v.isString().required())
                .field('age', v => v.isNumber().min(18))
                .field('country', v => v.isString().required())
                .field('stateCount', v =>
                  v
                    .max(1, { message: 'only with one country' })
                    .custom(
                      (stateCount, $source) =>
                        $source.country === 'USA' ? stateCount === 50 : stateCount === 26,
                      'correctStateCountry',
                    ),
                )
                .field('startDate', v => v.isDate().required())
                .field('endDate', v =>
                  v
                    .isDate()
                    .required()
                    .compareToField(
                      'startDate',
                      (endDate, startDate) => endDate > startDate,
                      'hasToBeGreaterThan',
                    ),
                ),
            ),
        ),
    ),
  )
  .build()

const testArray = Wallydator.from({ fruits: ['apple', 'grapes', 'kiwi'] })
  .field('fruits', v =>
    v
      .required()
      .isArray()
      .validateArray(array =>
        array.root(r => r.includes('pineapple', { message: 'you should eat pineapples' })),
      ),
  )
  .build()

console.log(testArray)
console.error(checkValidation(source, validationFn))
console.error(arrayValidation)
console.error(arrayWithObjectsValidation)
