import {ReadonlySignal, Signal, signal} from '@preact/signals-core';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import {EventEmitter} from '../utils/Events.ts';
import {IGamePlayService} from './GamePlayService.ts';

export interface ITileInteractionService {
    onTileHover: EventEmitter<[string, {x: number; y: number}, HexagonTile]>;
    onTileClick: EventEmitter<[string, {x: number; y: number}, HexagonTile]>;
    onTileUnhover: EventEmitter<[string]>;
    emitTileHover(tileId: string): void;
    emitTileClick(tileId: string): void;
    emitTileUnhover(tileId: string): void;

    currentHoveredTile: ReadonlySignal<HexagonTile | null>;
}

export class TileInteractionService implements ITileInteractionService {
    onTileHover = new EventEmitter<[string, {x: number; y: number}, HexagonTile]>();
    onTileClick = new EventEmitter<[string, {x: number; y: number}, HexagonTile]>();
    onTileUnhover = new EventEmitter<[string]>();
    currentHoveredTile: Signal<HexagonTile | null> = signal(null);

    constructor(private gamePlayService: IGamePlayService) {}

    emitTileHover(tileId: string): void {
        const tile = this.gamePlayService.getTileById(tileId);
        const tilePos = tile?.to2D();
        if (tilePos && tile) {
            this.onTileHover.emit(tileId, tilePos, tile);
            this.currentHoveredTile.value = tile;
        } else {
            this.currentHoveredTile.value = null;
        }
    }

    emitTileClick(tileId: string): void {
        const tile = this.gamePlayService.getTileById(tileId);
        const tilePos = tile?.to2D();
        if (tilePos && tile) {
            this.onTileClick.emit(tileId, tilePos, tile);
            this.currentHoveredTile.value = null;
            this.currentHoveredTile.value = tile;
        }
    }

    emitTileUnhover(tileId: string): void {
        this.onTileUnhover.emit(tileId);
        this.currentHoveredTile.value = null;
    }
}
