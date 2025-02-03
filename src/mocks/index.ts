import { ValidationError } from '@/interfaces'
import { ValidationBuilder } from '@/core/builders'
import { Wallydator } from '..'

interface SourceDto {
  name: string
  age: number
  hasParentsPermission: boolean
  email: string
  notEqualsThis: string
  arrayField: any[]
  maybeValidateThisEmbedded: MaybeValidateThisEmbedded
  nested: Nested
}

interface MaybeValidateThisEmbedded {
  maybe: boolean
}

interface Nested {
  data: string
  dataRequiredIf: number
  nested2: Nested2
}

interface Nested2 {
  data2: string
}

const source: SourceDto = {
  name: 'John Doex',
  age: 16,
  hasParentsPermission: false,
  email: 'john.doe@email.com',
  notEqualsThis: 'a-value',
  arrayField: [],
  maybeValidateThisEmbedded: {
    maybe: false,
  },
  nested: {
    data: 'nested data',
    dataRequiredIf: 1,
    nested2: {
      data2: 'more nested data',
    },
  },
}

const validationFn = (src: SourceDto): ValidationBuilder => {
  const validation = Wallydator.from(src)
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
      v.isObject().validateNested((nested, $root: SourceDto) =>
        nested
          .field('data', vv => vv.isString().required())
          .field('dataRequiredIf', vv =>
            vv
              .requiredIf('data', data => data === 'nested data' && $root.name === 'John Doex', {
                message: 'error message here...',
              })
              .isString(),
          )
          .field('nested2', vv =>
            vv
              .isObject()
              .validateNested((nested2, $parentNested: Nested) =>
                $parentNested.data ? nested2.field('dataError', vvv => vvv.required()) : null,
              ),
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

  if ('maybeValidateThisEmbedded' in src) {
    validation.field('maybeValidateThisEmbedded', v =>
      v.validateNested(builder =>
        builder.field('maybe', maybe =>
          maybe.required().equals(true, { message: 'should be true' }),
        ),
      ),
    )
  }

  return validation
}

function checkValidation(
  src: any,
  validationWrapper: (s: any) => ValidationBuilder,
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
      startDate: 1,
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
                    .max(1, { message: 'one-state country one' })
                    .custom(
                      (stateCount, $source) =>
                        $source.country === 'USA' ? stateCount === 50 : stateCount === 26,
                      'correctStateCountry',
                    ),
                )
                .field('startDate', v => v.isDate({ message: 'should be a valid date' }).required())
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
