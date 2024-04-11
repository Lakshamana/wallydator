import { ValidationBuilder } from '@/builders/abstract'

export type ValidationBuilderWrapper = (source: Object | any[]) => ValidationBuilder
