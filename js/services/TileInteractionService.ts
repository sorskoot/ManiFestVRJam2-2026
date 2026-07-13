import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import { EventEmitter } from '../utils/Events.ts';

export interface ITileInteractionService {
    onTileHover:EventEmitter<[string]>;
    onTileClick:EventEmitter<[string]>;
    onTileUnhover:EventEmitter<[string]>;
    emitTileHover(tileId: string): void;
    emitTileClick(tileId: string): void;
    emitTileUnhover(tileId: string): void;
}

export class TileInteractionService implements ITileInteractionService {
    onTileHover = new EventEmitter<[string]>();
    onTileClick = new EventEmitter<[string]>();
    onTileUnhover = new EventEmitter<[string]>();

    emitTileHover(tileId: string): void {
        this.onTileHover.emit(tileId);
    }

    emitTileClick(tileId: string): void {
        this.onTileClick.emit(tileId);
    }

    emitTileUnhover(tileId: string): void {
        this.onTileUnhover.emit(tileId);
    }
}
