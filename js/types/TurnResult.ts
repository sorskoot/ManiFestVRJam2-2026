import {ElementReserves, ElementValues} from '../hexagonmap/Element.ts';
import {Card} from './Card.ts';

export type {ElementReserves};

export type TurnFailureReason =
    | 'no-active-game'
    | 'invalid-card'
    | 'invalid-target'
    | 'insufficient-resources'
    | 'unsupported-card';

export interface SuccessfulTurnResult {
    success: true;
    card: Card;
    targetTileId: string;
    changedTileIds: string[];
    resourceChanges: ElementValues;
    generatedEssence: ElementValues;
    objectiveChanges: string[];
    turnNumber: number;
}

export interface FailedTurnResult {
    success: false;
    reason: TurnFailureReason;
}

export type TurnResult = SuccessfulTurnResult | FailedTurnResult;
