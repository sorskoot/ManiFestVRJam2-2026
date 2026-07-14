import {Component, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import {Noise, wlUtils} from '@sorskoot/wonderland-components';
import {Cursor} from '@wonderlandengine/components';
import {TileType} from '../hexagonmap/TileType.ts';
import {TilePrefabs} from './tile-prefabs.ts';
import {TileData} from './tile-data.ts';
import {IGamePlayService} from '../services/GamePlayService.ts';
import {serviceLocator} from '../utils/ServiceLocator.ts';
import {Services} from '../bootstrap-services.ts';
import {GameEvents} from '../services/GameEvents.ts';

const TileAssets: Record<TileType, string> = {
    [TileType.Grass]: 'GrassTile',
    [TileType.Forest]: 'ForestTile',
    [TileType.Hill]: 'HillTile',
    [TileType.Mountain]: 'MountainTile',
    [TileType.Lake]: 'WaterTile',
    [TileType.Volcano]: 'VolcanoTile',
    [TileType.Desert]: 'SandTile',
};

/**
 * Component responsible for managing the hexagonal grid layout.
 */
export class HexGridLayout extends Component {
    static TypeName = 'hex-grid-layout';

    static onRegister(engine: WonderlandEngine) {
        engine.registerComponent(TileData);
    }

    @property.object({required: true})
    public cursorObject!: Object3D;

    @property.object({required: true})
    public highlight!: Object3D;

    @property.object({required: true})
    declare public tilePrefabsObject: Object3D;
    declare private tilePrefabs: TilePrefabs;

    private get gamePlayService(): IGamePlayService {
        return serviceLocator.get<IGamePlayService>(Services.gamePlayService);
    }

    private tileModels: Map<string, Object3D> = new Map();
    private tileTypes: Map<string, TileType> = new Map();

    declare private cursor: Cursor;
    declare private hoveringTile?: HexagonTile;

    init() {
        this.tilePrefabs = this.tilePrefabsObject.getComponent(TilePrefabs)!;
    }

    /**
     * Initializes the component and sets up the grid.
     */
    public start(): void {
        Noise.seed(Date.now());

        this.cursor = this.cursorObject.getComponent(Cursor)!;
        this.highlight.setScalingLocal([0, 0, 0]);
    }

    /**
     * Activates the component and adds event listeners.
     */
    public onActivate(): void {
        const gameEvents = serviceLocator.get<GameEvents>(Services.gameEvents);
        gameEvents.gameStarted.add(this.onGameLoaded);
        this.gamePlayService.onWorldChanged.add(this.onWorldChanged);
    }

    /**
     * Deactivates the component and removes event listeners.
     */
    public onDeactivate(): void {
        const gameEvents = serviceLocator.get<GameEvents>(Services.gameEvents);
        gameEvents.gameStarted.remove(this.onGameLoaded);
        this.gamePlayService.onWorldChanged.remove(this.onWorldChanged);
    }

    private onGameLoaded = () => {
        this.clearGrid();
        this._createGrid();
    };

    private onWorldChanged = (tileIds: string[]) => {
        for (const tileId of tileIds) {
            const tile = this.gamePlayService.getTileById(tileId);
            if (tile) this.syncTile(tile);
        }
    };

    /**
     * Creates the hexagonal grid and populates it with tiles.
     */
    private _createGrid(): void {
        const tiles = this.gamePlayService.getAllTiles();
        for (const tile of tiles) {
            this.syncTile(tile);
        }
    }

    private syncTile(tile: HexagonTile): void {
        if (this.tileTypes.get(tile.id) === tile.terrain) {
            return;
        }
        const previousModel = this.tileModels.get(tile.id);
        if (previousModel && !previousModel.isDestroyed) {
            previousModel.destroy();
        }

        const hex = this.tilePrefabs.spawn(TileAssets[tile.terrain])!;
        hex.addComponent(TileData, {tileId: tile.id});
        hex.parent = this.object;
        const pos = tile.to2D();
        hex.setPositionLocal([pos.x, 0, pos.y]);
        wlUtils.setActive(hex, true);
        this.tileModels.set(tile.id, hex);
        this.tileTypes.set(tile.id, tile.terrain);
    }

    private clearGrid(): void {
        for (const model of this.tileModels.values()) wlUtils.setActive(model, false);
        this.tileModels.clear();
        this.tileTypes.clear();
    }
}
