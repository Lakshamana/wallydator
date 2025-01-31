import { ArrayValidationBuilderContract, ObjectValidationBuilderContract } from '@/interfaces'

export type ValidationBuilderWrapper = (source: Object | any[]) => ObjectValidationBuilderContract | ArrayValidationBuilderContract
