# Wallydator

This library is intended to serve as a flexible form validator runtime. Yes, it's a reference to [Wally Gator](https://en.wikipedia.org/wiki/Wally_Gator), just for fun =)

## Usage

```ts
import { ValidationBuilder } from 'wallydator';

const source = {
  name: 'John Doe',
  age: 16,
  hasParentsPermission: true, // good boy
};

const errors = ValidationBuilder.from(source)
  .field('name', (v) => v.isString().required().equals('John Doe'))
  .field('age', (v) => v.required().isNumber())
  .field('email', (v) => v.isString().required().email())
  .field('hasParentsPermission', (v) =>
    v
      .requiredIf('age', (age) => age < 18)
      .isBoolean()
      .equals(true),
  )
  .build();
```

Pro-tip: take a look at `src/mocks/index.ts`!

## Builder API

- [from](#from-source-objectvalidationbuilder)
  - Creates a new instance of the validation builder
- [fromArray](#fromarray-source-arrayvalidationbuilder)
  - Creates a new instance of the validation builder for an array of objects
- [field](#field-field-validatorfn-objectvalidationbuilder)
  - Adds a new field to the validation process
- [build](#build--validationerror--null)
  - Runs the validation process and returns an object of errors. If the validation passes, it will return null

### `from (source): ObjectValidationBuilder`

Parameters

- source `Object` - The object to be validateNested

Returns

`ObjectValidationBuilder` - A new object validation builder instance

### `fromArray (source): ArrayValidationBuilder`

Parameters

- source `any[]` - The array to be validated

Returns

`ArrayValidationBuilder` - A new array validation builder instance

### `field (field, validatorFn): ObjectValidationBuilder`

Parameters

- field `string` - The field name to be validated
- validatorFn `(validator: ValidationStage) => ValidationStage` - The validation function to be applied to the field

Returns

`ValidationBuilder` - The same validation builder instance, but with the new field added to the validation process. Notice you may chain multiple field calls

Example:

```ts
Wallydator.from({ name: 'John Doe', age: 18 })
  .field('name', (v) => v.isString().required())
  .field('age', (v) => v.isNumber().min(18))
  .build();
```

### `build (): ValidationError | null`

Returns

`ValidationError | null` - Object describing each error found during the validation process.

Examples

```ts
> Wallydator.from({ name: 'John Doe', age: 18 })
  .field('name', (v) => v.isString().required())
  .field('age', (v) => v.isNumber().min(18))
  .build()

null  // pass
```

```ts
> Wallydator.fromArray([ { name: 'John Doe', age: 18 }, { name: 'Jane Doe', age: 16 } ])
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

{ '1.age': ['min'] }  // error on the second item
```

## Validation API

Every method below will return either a `ValidationStage` or a `ArrayValidationStage` instance. The `ValidationStage` is used to validate single values, whereas the `ValidationStageArray` is used to validate arrays. Any of these will throw `NoSourceDefined` error if the source is not defined (`null` | `undefined`)

- [isString](#isstring--validationstage)
  - Checks whether the value is a string
- [isNumber](#isnumber--validationstage)
  - Checks whether the value is a number
- [isBoolean](#isboolean--validationstage)
  - Checks whether the value is a boolean
- [isNumeric](#isnumeric--validationstage)
  - Checks whether the value is a number or a data that can be converted to a number
- [isDate](#isdate--validationstage)
  - Checks whether the value is a valid JS Date object
- [isObject](#isobject--validationstage)
  - Checks whether the value is an object (excluding arrays and null values)
- [isArray](#isarray--validationstage)
  - Checks whether the value is an array
- [required](required--validationstage)
  - Checks whether the value is not null or undefined or an empty string
- [requiredIf](#requiredif-field-callbackfn-base-validationstage)
  - Checks whether the value is required if a given condition is met. Optionally can receive a reference to parent object, which useful for nested validations where you need to take into account a parent object field value
- [equals](#equals-equalsvalue-validationstage)
  - Checks whether the value is equal to a given value. It will perform a strict comparison (=== operator)
- [notEmptyObject](#notemptyobject--validationstage)
  - Checks whether the value is an object and it has at least one property
- [min](#min-value-validationstage)
  - Checks whether the value is greater than or equal to a given value
- [max](#max-value-validationstage)
  - Checks whether the value is less than or equal to a given value
- [length](#length-value-validationstage)
  - Checks whether the value has a length equal to a given value
- [minLength](#minlength--validationstage)
  - Checks whether the value has a length greater than or equal to a given value
- [maxLength](#maxlength--validationstage)
  - Checks whether the value has a length less than or equal to a given value
- [regex](#regex-pattern-validationstage)
  - Checks whether the value matches a given regular expression
- [email](#email--validationstage)
  - Checks whether the value is a valid email address
- [custom](#custom-callbackfn-validationstage)
  - Allows you to define a custom validation function. The function must return a boolean value and return true if the validation passes
- [validateNested](#validatenested-callbackfn-validationstage)
  - Allows you to validate nested objects. You may validate as many nest levels as you need
- [validateArray](#validatearray-callbackfn-validationstage)
  - Allows you to validate arrays
- [notEmptyArray](notemptyarray--arrayvalidationstage)
  - Checks whether the value is an array and it has at least one element
- [includes](#includes-value-arrayvalidationstage)
  - Checks whether the value includes a given value
- [includesAll](#includesall-values-arrayvalidationstage)
  - Checks whether the value includes all given values
- [every](#every-callbackfn-arrayvalidationstage)
  - Checks whether every element in the array passes a given validation
- [some](#some-callbackfn-arrayvalidationstage)
  - Checks whether at least one element in the array passes a given validation

### `isString (): ValidationStage`

### `isNumber (): ValidationStage`

### `isBoolean (): ValidationStage`

### `isNumeric (): ValidationStage`

### `isObject (): ValidationStage`

### `isArray (): ValidationStage`

### `isDate (): ValidationStage`

### `required (): ValidationStage`

### `requiredIf (field, callbackFn, base?): ValidationStage`

Parameters

- field `string` - The field name to be checked
- callbackFn `(value: any) => boolean` - The function that will be called to check whether the field is required. This function must return true if the field is required
- base? `ValidationBuilder` - Base validation builder upon which the callbackFn will be run against

### `equals (equalsValue): ValidationStage`

Parameters

- equalsValue `any` - The value to be compared against field value

### `notEmptyObject (): ValidationStage`

### `min (value): ValidationStage`

Parameters

- value `number` - The minimum value

### `max (value): ValidationStage`

Parameters

- value `number` - The maximum value

### `length (value): ValidationStage`

Parameters

- value `number` - The expected length

### `minLength (minValue): ValidationStage`

Parameters

- minValue `number` - The expected minimum length

### `maxLength (): ValidationStage`

Parameters

- value `number` - The expected maximum value

### `regex (pattern): ValidationStage`

Parameters

- pattern `RegExp` - The regex pattern to be tested against the field value

### `email (): ValidationStage`

### `custom (callbackFn): ValidationStage`

Parameters

- callbackFn `(value: any) => boolean` - The custom validation function. It must return true if the validation passes

### `validateNested (callbackFn): ValidationStage`

Parameters

- callbackFn `callbackFn: (builder: ObjectValidationBuilder, parent: ValidationBuilder) => ValidationError | null` - The function that will be called to validate the nested object. It receives a new `ObjectValidationBuilder` instance and the parent `ValidationBuilder` instance

### `validateArray (callbackFn): ValidationStage`

Parameters

- callbackFn `callbackFn: (builder: ObjectValidationBuilder, parent: ValidationBuilder) => ValidationError | null` - The function that will be called to validate the nested object. It receives a new `ObjectValidationBuilder` instance and the parent `ValidationBuilder` instance

### `notEmptyArray (): ArrayValidationStage`

### `includes (value): ArrayValidationStage`

Parameters

- value `any` - The value to be checked

### `includesAll (values): ArrayValidationStage`

Parameters

- values `any[]` - The values to be checked

### `every (callbackFn): ArrayValidationStage`

Parameters

- callbackFn `(val: any) => boolean` - The callback to be called for each element in the array. This should return true if the validation passes

### `some (callbackFn): ArrayValidationStage`

Parameters

- callbackFn `(val: any) => boolean` - The callback to be called for each element in the array. This should return true if the validation passes
