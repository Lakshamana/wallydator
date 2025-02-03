import { ArrayValidationStage, ValidationStage } from '@/core/stages'

export type ValidationFunction = (validator: ValidationStage) => ValidationStage

export type ArrayValidationFunction = (validator: ArrayValidationStage) => ArrayValidationStage
