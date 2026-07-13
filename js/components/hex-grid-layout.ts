import {Component, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {HexagonGrid} from '../hexagonmap/HexGrid.ts';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
// import { MyCursor } from '../generic/my-cursor.js';
import {vec3} from 'gl-matrix';
import {Noise, rng, wlUtils} from '@sorskoot/wonderland-components';
import {Cursor} from '@wonderlandengine/components';
import {TileType} from '../hexagonmap/TileType.ts';
import {TilePrefabs} from './tile-prefabs.ts';
import {CellValues} from '../hexagonmap/CellValues.ts';
import {TerrainDefinitions} from '../hexagonmap/TerrainDefinition.ts';
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
// import {GameCore} from '@/classes/core/GameCore.js';
// import {StepsPipeline} from '@/classes/generator/core/StepsPipeline.ts';
// import {BaseStepExec, StepContext} from '@/classes/generator/core/Steps.ts';
// import {CreateHexagonGridExec, CreateHexagonGridParameters} from '@/classes/generator/steps/CreateHexagonGrid.ts';
// import {RenderHexagonGridExec} from '@/classes/generator/steps/RenderHexagonGrid.ts';
// import {FlattenAroundCastleExec, FlattenAroundCastleParameters} from '@/classes/generator/steps/FlattenAroundCastle.ts';
// import {AddResourcesExec} from '@/classes/generator/steps/AddResources.ts';
// import {ServiceLocator} from '@sorskoot/wonderland-components';

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
        serviceLocator.get<GameEvents>(Services.gameEvents).gameStarted.add(this._onGameLoaded);
    }

    /**
     * Deactivates the component and removes event listeners.
     */
    public onDeactivate(): void {
        serviceLocator.get<GameEvents>(Services.gameEvents).gameStarted.remove(this._onGameLoaded);
    }

    private _onGameLoaded = () => {
        this._createGrid();
    };
    update(dt: number): void {
        // if (this.grid == null && this.tilePrefabs.isLoaded) {
        //     this._createGrid();
        // }
    }
    /**
     * Creates the hexagonal grid and populates it with tiles.
     */
    private _createGrid(): void {
        // const pipeline = new StepsPipeline<BaseStepExec>();
        // pipeline.addStep(new CreateHexagonGridExec(), new CreateHexagonGridParameters());
        // const flattenParams = new FlattenAroundCastleParameters();
        // flattenParams.startElevation = 0.75;
        // pipeline.addStep(new FlattenAroundCastleExec(), flattenParams);
        // pipeline.addStep(new AddResourcesExec());
        // pipeline.addStep(new RenderHexagonGridExec());
        // const context = new StepContext({
        //     rockThreshold: 0.3,
        // });
        // const result = pipeline.execute(context);

        const tiles = this.gamePlayService.getAllTiles();
        for (const tile of tiles) {
            const pos = tile.to2D();
            let hex: Object3D | null = null;
            // switch (tile.type) {
            //     case TileType.Grass:
            const type = this.determineTileType(tile.cellValues);
            hex = this.tilePrefabs.spawn(TileAssets[type])!;
            hex.addComponent(TileData, {tileId: tile.id});
            hex.parent = this.object;
            this.tileModels.set(tile.id, hex);
            //    break;
            //}
            // if (!hex) {
            //       throw new Error(`No prefab found for tile type: ${tile.type}`);
            // }
            hex.setPositionLocal([pos.x, 0, pos.y]);
            wlUtils.setActive(hex, true);
        }
    }

    // /**
    //  * Handles tile click events.
    //  */
    // private _onTileClick = (tilePos: {x: number; y: number; z: number}): void => {
    //     if (!this.grid) {
    //         return;
    //     }
    //     const tile = this.grid.getTile(tilePos.x, tilePos.y, tilePos.z);
    // };

    // /**
    //  * Handles tile hover events.
    //  */
    // private _onTileHover = (tilePos: {x: number; y: number; z: number}): void => {
    //     if (!this.grid) {
    //         return;
    //     }
    //     const tile = this.grid.getTile(tilePos.x, tilePos.y, tilePos.z);
    //     if (tile) {
    //         //this.engine.canvas.style.cursor = 'none';
    //         this.hoveringTile = tile;
    //         const pos = vec3.create();
    //         this.tileModels.get(tile.id)?.getPositionWorld(pos);
    //         this.highlight.setScalingLocal([1, 1, 1]);
    //         this.highlight.setPositionWorld(pos);
    //     } else {
    //         this.highlight.setScalingLocal([0, 0, 0]);
    //         //    this.engine.canvas.style.cursor = 'auto';
    //     }
    // };

    private determineTileType(cellValues: CellValues): TileType {
        // Run through terrain definitions
        // keep track of the closest match based on manhattan distance
        let closestType: TileType = TileType.Grass;
        let closestDistance = Infinity;
        for (const [type, definition] of Object.entries(TerrainDefinitions)) {
            const distance = this.calculateManhattanDistance(cellValues, definition.cellValues);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestType = type as TileType;
            }
        }

        return closestType;
    }

    private calculateManhattanDistance(values1: CellValues, values2: CellValues): number {
        return (
            Math.abs(values1.moisture - values2.moisture) +
            Math.abs(values1.temperature - values2.temperature) +
            Math.abs(values1.fertility - values2.fertility) +
            Math.abs(values1.elevation - values2.elevation)
        );
    }
}
