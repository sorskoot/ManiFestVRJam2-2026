import {ReadonlySignal, signal} from '@preact/signals-core';
import {IUiStateService} from './UiStateService.ts';
import {GameEvents} from './GameEvents.ts';
import {IConfigService} from './ConfigService.ts';

export enum GameState {
    TitleScreen = 'title-screen',
    Menu = 'menu',
    Playing = 'playing',
    Paused = 'paused',
    GameOver = 'game-over',
}

export interface IGameFlowService {
    get gameState(): ReadonlySignal<GameState>;
    toMenu(): void;
}

export class GameFlowService implements IGameFlowService {
    constructor(
        private uiStateService: IUiStateService,

        private gameEvents: GameEvents
    ) {
        // this.gameEvents.gameStarted.add(this.puzzleCompleted);
    }

    private _gameState = signal(GameState.Menu);
    get gameState(): ReadonlySignal<GameState> {
        return this._gameState;
    }

    toMenu(): void {
        console.log('Returning to main menu...');
        this._gameState.value = GameState.Menu;
        this.uiStateService.returnToMenu();
    }
}
