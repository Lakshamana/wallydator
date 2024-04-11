import { ValidationStage } from '@/builders/stages'

export type ValidationFunction = (validator: ValidationStage) => ValidationStage
