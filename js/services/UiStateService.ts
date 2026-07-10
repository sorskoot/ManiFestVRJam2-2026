import {ReadonlySignal, Signal, signal} from '@preact/signals-core';
import {GameEvents} from './GameEvents.ts';

type UiMode = 'main-menu' | 'in-game';

type UiOverlay = 'help' | 'settings';

export interface IUiStateService {
    get mode(): ReadonlySignal<UiMode>;
    get overlays(): ReadonlySignal<UiOverlay[]>;
    showHud(): void;
    startGame(): void;
    returnToMenu(): void;
    openHelp(): void;
    openSettings(): void;
    closeTopOverlay(): void;
    closeAllOverlays(): void;
}

export class UiStateService implements IUiStateService {
    public get mode(): ReadonlySignal<UiMode> {
        return this._mode;
    }
    public get overlays(): ReadonlySignal<UiOverlay[]> {
        return this._overlays;
    }

    private _mode: Signal<UiMode>;
    private _overlays: Signal<UiOverlay[]>;

    constructor() {
        this._mode = signal('main-menu');
        this._overlays = signal([]);
    }

    showHud(): void {
        this._mode.value = 'in-game';
    }

    startGame(): void {
        console.log('Starting game...');
    }
    returnToMenu(): void {
        console.log('Returning to main menu...');
    }
    openHelp(): void {
        console.log('Opening help overlay...');
    }
    openSettings(): void {
        console.log('Opening settings overlay...');
    }
    closeTopOverlay(): void {
        console.log('Closing top overlay...');
    }
    closeAllOverlays(): void {
        console.log('Closing all overlays...');
    }
}
