import {EventEmitter} from '../utils/Events.ts';

export interface GameStartedEvent {}

export class GameEvents {
    readonly gameStarted = new EventEmitter<[GameStartedEvent]>();
}
