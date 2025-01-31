import { Wallydator } from '@/index'

describe('Wallydator.from', () => {
  it('should return null on valid objects', () => {
    const validatorRoot = Wallydator.from({
      name: 'John Doe',
      age: 30,
    })

    const result = validatorRoot
      .field('name', v => v.isString().required())
      .field('age', v => v.isNumber().required())
      .build()

    expect(result).toBeNull()
  })

  it('should return null on invalid objects', () => {
    const validatorRoot = Wallydator.from({
      name: 'John Doe',
      age: 16,
    })

    const result = validatorRoot
      .field('name', v => v.isString().required())
      .field('age', v => v.isNumber().required().min(18))
      .build()

    expect(result).toStrictEqual({ age: ['min'] })
  })

  it('should return null on invalid nested objects', () => {
    const validatorRoot = Wallydator.from({
      name: 'John Doe',
      age: 16,
      interests: ['sports', 'music', 'tech'],
    })

    const result = validatorRoot
      .field('name', v => v.isString().required())
      .field('age', v => v.isNumber().required().min(18))
      .field('interests', v => v.validateArray(
        array => array.root(r => r.includes(['healthy']))
      ))
      .build()

    console.log({ result });

    expect(result).toStrictEqual({ age: ['min'] })
  })
})

describe('Wallydator.fromArray', () => {
  it('should return null on valid objects', () => {
    const validatorRoot = Wallydator.fromArray([0, 1, 2, 3, 4])

    const result = validatorRoot
      .root(r => r.minLength(5))
      .for(item => item.isNumber().isInteger())
      .build()

    expect(result).toBeNull()
  })
})
