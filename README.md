# Wallydator

This library is intended to serve as a flexible form validator runtime. Yes, it's a reference to [Wally Gator](https://en.wikipedia.org/wiki/Wally_Gator), just for fun =)

## Usage
```ts
import { ValidationBuilder } from 'wallydator'

const source = {
  name: 'John Doe',
  age: 16,
  hasParentsPermission: true  // good boy
}

const errors = ValidationBuilder.from(source)
  .field('name', (v) => v.isString().required().equals('John Doe'))
  .field('age', (v) => v.required().isNumber())
  .field('email', (v) => v.isString().required().email())
  .field('hasParentsPermission', (v) =>
    v.requiredIf('age', (age) => age < 18).isBoolean().equals(true)
  )
  .build()
```

Pro-tip: take a look at `src/mocks/index.ts`!

## API

