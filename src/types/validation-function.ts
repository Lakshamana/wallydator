import { ArrayValidationStage, ValidationStage } from '@/builders/stages'

export type ValidationFunction = (validator: ValidationStage) => ValidationStage

export type ArrayValidationFunction = (validator: ArrayValidationStage) => ArrayValidationStage
