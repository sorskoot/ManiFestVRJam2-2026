import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {HexagonGrid} from '../hexagonmap/HexGrid.ts';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
// import { MyCursor } from '../generic/my-cursor.js';
import {vec3} from 'gl-matrix';
import {Noise, rng, wlUtils} from '@sorskoot/wonderland-components';
import {Cursor} from '@wonderlandengine/components';
import {TileType} from '../hexagonmap/TileType.ts';
import {TilePrefabs} from './tile-prefabs.ts';

const TileAssets = ['GrassTile', 'ForestTile', 'HillTile', 'MountainTile', 'WaterTile', 'VolcanoTile', 'SandTile'];
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

    @property.object({required: true})
    public cursorObject!: Object3D;

    @property.object({required: true})
    public highlight!: Object3D;

    @property.object({required: true})
    declare public tilePrefabsObject: Object3D;
    declare private tilePrefabs: TilePrefabs;

    private _grid!: HexagonGrid;
    public get grid(): HexagonGrid {
        return this._grid;
    }
    private _myCursor!: Cursor;
    private _hoveringTile: HexagonTile | null = null;

    init() {
        this.tilePrefabs = this.tilePrefabsObject.getComponent(TilePrefabs)!;
    }

    /**
     * Initializes the component and sets up the grid.
     */
    public start(): void {
        Noise.seed(Date.now());

        this._myCursor = this.cursorObject.getComponent(Cursor)!;
        this.highlight.setScalingLocal([0, 0, 0]);
        //ServiceLocator.get(GameCore).onLoaded.add(this._onGameLoaded);
    }

    /**
     * Activates the component and adds event listeners.
     */
    public onActivate(): void {
        // this._myCursor.onTileHover.add(this._onTileHover);
        // this._myCursor.onTileClick.add(this._onTileClick);
    }

    /**
     * Deactivates the component and removes event listeners.
     */
    public onDeactivate(): void {
        // this._myCursor.onTileHover.remove(this._onTileHover);
        // this._myCursor.onTileClick.remove(this._onTileClick);
    }

    private _onGameLoaded = () => {
        this._createGrid();
    };
    update(dt: number): void {
        if (this._grid == null && this.tilePrefabs.isLoaded) {
            this._createGrid();
        }
    }
    /**
     * Creates the hexagonal grid and populates it with tiles.
     */
    private _createGrid(): void {
        this._grid = new HexagonGrid();
        const center = new HexagonTile(0, 0, 0, TileType.Grass, 0.1);
        this._grid.addTile(center);
        const newtiles = this._expand(this._grid, [center]);
        this._expand(this._grid, newtiles);
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

        const tiles = this._grid.getAllTiles();
        for (const tile of tiles) {
            const pos = tile.to2D();
            let hex: Object3D | null = null;
            switch (tile.type) {
                case TileType.Grass:
                    hex = this.tilePrefabs.spawn(rng.getItem(TileAssets))!;
                    hex.parent = this.object;
                    break;
            }
            if (!hex) {
                throw new Error(`No prefab found for tile type: ${tile.type}`);
            }
            hex.setPositionLocal([pos.x, tile.elevation, pos.y]);
            wlUtils.setActive(hex, true);
        }
    }

    /**
     * Expands the grid by adding new tiles around the given tiles.
     * @param tiles - The tiles to expand around.
     * @returns The newly added tiles.
     */
    private _expand(grid: HexagonGrid, tiles: HexagonTile[]): HexagonTile[] {
        const newTiles: HexagonTile[] = [];
        tiles.forEach((tile) => {
            for (const neighborCoords of tile.neighbors()) {
                if (!grid.getTile(neighborCoords.x, neighborCoords.y, neighborCoords.z)) {
                    const pos = tile.to2D();
                    // let value = Noise.simplex2(
                    //     pos.x / this._context.config.noiseScale + this._context.config.noiseOffset,
                    //     pos.y / this._context.config.noiseScale + this._context.config.noiseOffset
                    // );
                    // value = (value + 1) / 2; // Normalize to [0, 1]
                    const newTile = new HexagonTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z,
                        TileType.Grass,
                        0.1
                        // value > this._context.config.waterLevel ? TileType.Grass : TileType.Water,
                        // Mathf.clamp(value, this._context.config.waterLevel, 1) -
                        // this._context.config.waterLevel
                    );

                    grid.addTile(newTile);
                    newTiles.push(newTile);
                }
            }
        });
        return newTiles;
    }

    /**
     * Handles tile click events.
     */
    private _onTileClick = (tilePos: {x: number; y: number; z: number}): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
    };

    /**
     * Handles tile hover events.
     */
    private _onTileHover = (tilePos: {x: number; y: number; z: number}): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        if (tile) {
            //this.engine.canvas.style.cursor = 'none';
            this._hoveringTile = tile;
            const pos = vec3.create();
            //tile.object.getPositionWorld(pos);
            this.highlight.setScalingLocal([1, 1, 1]);
            this.highlight.setPositionWorld(pos);
        } else {
            this.highlight.setScalingLocal([0, 0, 0]);
            //    this.engine.canvas.style.cursor = 'auto';
        }
    };
}
