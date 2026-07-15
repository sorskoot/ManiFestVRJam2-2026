import {EeUtils} from '../utils/EeUtils.ts';
import {CellValues} from '../hexagonmap/CellValues.ts';
import {createEmptyElementValues, ElementValues} from '../hexagonmap/Element.ts';
import {HexagonGrid} from '../hexagonmap/HexGrid.ts';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import {TerrainDefinitions} from '../hexagonmap/TerrainDefinition.ts';
import {TileType} from '../hexagonmap/TileType.ts';
import {IConfigService} from './ConfigService.ts';

export interface SimulationResult {
    changedTileIds: string[];
    generatedEssence: ElementValues;
    objectiveChanges: string[];
}

export interface ISimulationService {
    runSimulation(grid: HexagonGrid): SimulationResult;
    resolveTerrain(values: CellValues): TileType;
    resolveTerrains(grid: HexagonGrid, changedTileIds: Set<string>): void;
}

export class SimulationService implements ISimulationService {
    constructor(private configService: IConfigService) {}

    public runSimulation(grid: HexagonGrid): SimulationResult {
        const changedTileIds = new Set<string>();

        this.diffuseCellValues(grid, changedTileIds);
        this.applyTerrainInfluences(grid, changedTileIds);
        this.incrementTileAges(grid, changedTileIds);
        this.resolveTerrains(grid, changedTileIds);

        return {
            changedTileIds: [...changedTileIds],
            generatedEssence: this.generateEssence(grid, changedTileIds),
            objectiveChanges: this.evaluateObjectives(),
        };
    }

    private diffuseCellValues(grid: HexagonGrid, changedTileIds: Set<string>): void {
        const nextValues = new Map<string, CellValues>();
        for (const tile of grid.getAllTiles()) {
            const neighbors = this.getNeighbors(grid, tile);
            if (neighbors.length === 0) continue;
            nextValues.set(tile.id, this.diffuseValues(tile.cellValues, neighbors));
        }

        for (const [tileId, values] of nextValues) {
            const tile = grid.getTileById(tileId)!;
            tile.cellValues.moisture = values.moisture;
            tile.cellValues.temperature = values.temperature;
            tile.cellValues.fertility = values.fertility;
            changedTileIds.add(tileId);
        }
    }

    getNeighbors(grid: HexagonGrid, tile: HexagonTile): HexagonTile[] {
        return tile.neighbors().flatMap((coordinates) => {
            const neighbor = grid.getTile(coordinates.x, coordinates.y, coordinates.z);
            return neighbor ? [neighbor] : [];
        });
    }

    diffuseValues(values: CellValues, neighbors: HexagonTile[]): CellValues {
        const average = this.averageValues(neighbors);
        return {
            moisture: this.interpolate(values.moisture, average.moisture),
            temperature: this.interpolate(values.temperature, average.temperature),
            fertility: this.interpolate(values.fertility, average.fertility),
            elevation: values.elevation,
        };
    }

    averageValues(tiles: HexagonTile[]): CellValues {
        const total = tiles.reduce(
            (values, tile) => ({
                moisture: values.moisture + tile.cellValues.moisture,
                temperature: values.temperature + tile.cellValues.temperature,
                fertility: values.fertility + tile.cellValues.fertility,
                elevation: values.elevation + tile.cellValues.elevation,
            }),
            {moisture: 0, temperature: 0, fertility: 0, elevation: 0}
        );
        return {
            moisture: total.moisture / tiles.length,
            temperature: total.temperature / tiles.length,
            fertility: total.fertility / tiles.length,
            elevation: total.elevation / tiles.length,
        };
    }

    interpolate(value: number, average: number): number {
        return value + (average - value) * this.configService.getDiffusionRate();
    }

    applyTerrainInfluences(grid: HexagonGrid, changedTileIds: Set<string>): void {
        for (const tile of grid.getAllTiles()) {
            const influence = TerrainDefinitions[tile.terrain].influences;
            if (this.isEmpty(influence)) {
                continue;
            }
            EeUtils.addCellValues(tile.cellValues, influence);
            changedTileIds.add(tile.id);
        }
    }

    isEmpty(values: CellValues): boolean {
        return values.moisture === 0 && values.temperature === 0 && values.fertility === 0 && values.elevation === 0;
    }

    incrementTileAges(grid: HexagonGrid, changedTileIds: Set<string>): void {
        for (const tile of grid.getAllTiles()) {
            tile.age += 1;
            changedTileIds.add(tile.id);
        }
    }

    resolveTerrains(grid: HexagonGrid, changedTileIds: Set<string>): void {
        for (const tile of grid.getAllTiles()) {
            const terrain = this.resolveTerrain(tile.cellValues);
            if (terrain === tile.terrain) {
                continue;
            }
            tile.terrain = terrain;
            changedTileIds.add(tile.id);
        }
    }

    resolveTerrain(values: CellValues): TileType {
        return Object.values(TileType).reduce((closest, terrain) => {
            const candidate = TerrainDefinitions[terrain];
            const current = TerrainDefinitions[closest];
            return this.distance(values, candidate.cellValues) < this.distance(values, current.cellValues)
                ? terrain
                : closest;
        }, TileType.Grass);
    }

    distance(left: CellValues, right: CellValues): number {
        return (
            Math.abs(left.moisture - right.moisture) +
            Math.abs(left.temperature - right.temperature) +
            Math.abs(left.fertility - right.fertility) +
            Math.abs(left.elevation - right.elevation)
        );
    }

    generateEssence(grid: HexagonGrid, changedTileIds: Set<string>): ElementValues {
        const generatedEssence = createEmptyElementValues();
        for (const tile of grid.getAllTiles()) {
            const element = TerrainDefinitions[tile.terrain].producedElement;
            if (!element) {
                continue;
            }
            tile.pendingEssence[element] = (tile.pendingEssence[element] ?? 0) + 1;
            generatedEssence[element] += 1;
            changedTileIds.add(tile.id);
        }
        return generatedEssence;
    }

    evaluateObjectives(): string[] {
        return [];
    }
}
