import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import { EventEmitter } from '../utils/Events.ts';
import { IGamePlayService } from './GamePlayService.ts';

export interface ITileInteractionService {
    onTileHover:EventEmitter<[string, {x: number; y: number}, HexagonTile]>;
    onTileClick:EventEmitter<[string, {x: number; y: number}, HexagonTile]>;
    onTileUnhover:EventEmitter<[string]>;
    emitTileHover(tileId: string): void;
    emitTileClick(tileId: string): void;
    emitTileUnhover(tileId: string): void;
}

export class TileInteractionService implements ITileInteractionService {
    onTileHover = new EventEmitter<[string, {x: number; y: number}, HexagonTile]>();
    onTileClick = new EventEmitter<[string, {x: number; y: number}, HexagonTile]>();
    onTileUnhover = new EventEmitter<[string]>();

    constructor(private gamePlayService: IGamePlayService) { 
        
    }

    emitTileHover(tileId: string): void {
        const tile = this.gamePlayService.getTileById(tileId);
        const tilePos = tile?.to2D();
        if (tilePos && tile) {
            this.onTileHover.emit(tileId, tilePos, tile);
        }
    }

    emitTileClick(tileId: string): void {
        const tile = this.gamePlayService.getTileById(tileId);
        const tilePos = tile?.to2D();
        if (tilePos && tile) {
            this.onTileClick.emit(tileId, tilePos, tile);
        }
    }

    emitTileUnhover(tileId: string): void {
        this.onTileUnhover.emit(tileId);
    }
}
