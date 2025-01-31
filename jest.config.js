/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'tests',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/../src/$1',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}
