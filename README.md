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

> Wallydator.from(source)
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

null  // pass
```

```ts
> Wallydator.from({ fruits: ['apple', 'grapes', 'kiwi'] })
  .field('fruits', v => v
    .required()
    .isArray()
    .validateArray(array =>
      array.root(r => r.includes('pineapple'))
    )
  )
  .build()

{ 'fruits': ['includes'] }  // error
```

Pro-tip: take a look at [src/mocks/index.ts](src/mocks/index.ts). You may run this mock by cloning this repo and running `npm run dev`.

## Builder API

- [from](#from-source-objectvalidationbuilder)
  - Creates a new instance of the validation builder
- [fromArray](#fromarray-source-arrayvalidationbuilder)
  - Creates a new instance of the validation builder for an array of objects
- [field](#field-field-validatorfn-objectvalidationbuilder)
  - Adds a new field to the validation process
- [build](#build--validationerror--null)
  - Runs the validation process and returns an object of errors. If the validation passes, it will return null. Will throw `NoSourceDefined` error if the source is not defined (`null` | `undefined`)
- [for](#for-validationfn-validationfunction-arrayvalidationbuilder)
  - Adds a new validation stage for each item in the array. It will pass an `ValidationStage` instance as an argument for the callback function, which means you may compose its argument with every function that returns `ValidationStage`, check the [Validation API](#validation-api) for a list of available methods
- [root](#root-validationfn-arrayvalidationfunction-arrayvalidationbuilder)
  - Adds a new validation stage to the root array validation process. It will pass an `ArrayValidationStage` instance as an argument for the callback function, which means you may compose its argument with every function that returns `ArrayValidationStage`, check the [Array Root Validation API](#array-root-validation-api) for a list of available methods

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
Wallydator.from({ name: "John Doe", age: 18 })
  .field("name", (v) => v.isString().required())
  .field("age", (v) => v.isNumber().min(18))
  .build();
```

### `build (): ValidationError | null`

Returns

`ValidationError | null` - Object describing each error found during the validation process.

Examples:

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
      )
  )
  .build()

{ '1.age': ['min'] }  // error on the second item
```

### `root (validationFn: ArrayValidationFunction): ArrayValidationBuilder`
Parameters

- validatorFn `(validator: ArrayValidationStage) => ArrayValidationStage` - The validation function to be applied to the array root object (that is, the array itself, not its elements)

Returns

`ArrayValidationBuilder` - Array root validation instance

Example:
```ts
> Wallydator.fromArray([])
    .root(r => r.isNotEmpty())
    .build()

// Notice that root validation errors will be displayed as '$root' if the source is an array, and as the field name if it's an object
{ $root: ['isNotEmpty'] }  // error on the root
```

### `for (validationFn: ValidationFunction): ArrayValidationBuilder`
Parameters

- validatorFn `(validator: ValidationStage) => ValidationStage` - The validation function to be applied for every root element

Returns

`ArrayValidationBuilder` - Array root validation instance

Example:
```ts
> Wallydator.fromArray([1, 2, 3, 4, 5])
    .for((item) => item.isNumber().min(1).max(3))
    .build()

{ '3': [ 'max' ], '4': [ 'max' ] }  // errors in the indexes 3 and 4
```

## Validation API

Every method below will return either a `ValidationStage` or an `ArrayValidationStage` instance. The `ValidationStage` is used to validate single values, whereas the `ArrayValidationStage` is used to validate arrays. Please notice that every method, except `required` will return `true` if the targeted value is `undefined`: this is not a bug, but rather a feature that allows you to define validations for optional fields, so if you have to validate the presence of a field, use `required` method.

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
- [notEquals](#notequals-value-validationstage)
  - Checks whether the value is not equal to a given value. It will perform a strict comparison (!== operator)
- [isNotEmpty](#isnotempty--validationstage)
  - Checks whether the value is:
      - an object and it has at least one property
      - an array and it's not empty
      - not a empty string
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
- [compareToField](#comparetofield-field-callbackfn-label-validationstage)
  - Allows you to compare the value to another source field value. It will display the error as `'compareToField:${label}'` if a label is found, otherwise `'compareToField:${field}'`
- [validateNested](#validatenested-callbackfn-validationstage)
  - Allows you to validate nested objects. You may validate as many nest levels as you need. Works the same as `from`. In fact, both will pass an `ObjectValidationBuilder` instance as an argument for the callback function
- [validateArray](#validatearray-callbackfn-validationstage)
  - Allows you to validate arrays. Works the same as `fromArray`. In fact, both will pass an `ArrayValidationBuilder` instance as an argument for the callback function

#### Array root validation API
The methods below are meant to be used for the root array validation only. They will return an `ArrayValidationStage` instance.

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

### `notEquals (value): ValidationStage`

Parameters

- value `any` - The value to be compared against field value

### `isNotEmpty (): ValidationStage`

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

### `compareToField (field, callbackFn, label?): ValidationStage`

Parameters

- field `string` - The field name whose value will be compared against current field
- callbackFn `callbackFn: (val: any, [field]: any) => boolean` - The function that will be called to compare the field values. It must return true if the validation passes
- label? `string` - The label to display the error. Ex: for `label = 'hasToBeGreatherThan'` it will display the error as `compareToField:hasToBeGreatherThan`

### `validateNested (callbackFn): ValidationStage`

Parameters

- callbackFn `callbackFn: (builder: ObjectValidationBuilder, parent: ValidationBuilder) => ValidationError | null` - The function that will be called to validate the nested object. It receives a new `ObjectValidationBuilder` instance and the parent `ValidationBuilder` instance

### `validateArray (callbackFn): ValidationStage`

Parameters

- callbackFn `callbackFn: (builder: ObjectValidationBuilder, parent: ValidationBuilder) => ValidationError | null` - The function that will be called to validate the nested object. It receives a new `ObjectValidationBuilder` instance and the parent `ValidationBuilder` instance

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

## Contributing

This project is open for contributions. Feel free to open an issue or a PR!

Hope y'all enjoy it as much as I did creating it =)
