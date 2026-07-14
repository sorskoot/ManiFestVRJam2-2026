import {EeUtils} from '../utils/EeUtils.ts';
import {CellValues} from './CellValues.ts';
import {createEmptyElementValues, ElementValues} from './Element.ts';
import {HexagonGrid} from './HexGrid.ts';
import {HexagonTile} from './HexagonTile.ts';
import {TerrainDefinitions} from './TerrainDefinition.ts';
import {TileType} from './TileType.ts';

const DIFFUSION_RATE = 0.2;

export interface SimulationResult {
    changedTileIds: string[];
    generatedEssence: ElementValues;
    objectiveChanges: string[];
}

export function runSimulation(grid: HexagonGrid): SimulationResult {
    const changedTileIds = new Set<string>();
    // diffuseCellValues(grid, changedTileIds);
    applyTerrainInfluences(grid, changedTileIds);
    incrementTileAges(grid, changedTileIds);
    resolveTerrains(grid, changedTileIds);

    return {
        changedTileIds: [...changedTileIds],
        generatedEssence: generateEssence(grid, changedTileIds),
        objectiveChanges: evaluateObjectives(),
    };
}

function diffuseCellValues(grid: HexagonGrid, changedTileIds: Set<string>): void {
    const nextValues = new Map<string, CellValues>();
    for (const tile of grid.getAllTiles()) {
        const neighbors = getNeighbors(grid, tile);
        if (neighbors.length === 0) continue;
        nextValues.set(tile.id, diffuseValues(tile.cellValues, neighbors));
    }

    for (const [tileId, values] of nextValues) {
        const tile = grid.getTileById(tileId)!;
        tile.cellValues.moisture = values.moisture;
        tile.cellValues.temperature = values.temperature;
        tile.cellValues.fertility = values.fertility;
        changedTileIds.add(tileId);
    }
}

function getNeighbors(grid: HexagonGrid, tile: HexagonTile): HexagonTile[] {
    return tile.neighbors().flatMap((coordinates) => {
        const neighbor = grid.getTile(coordinates.x, coordinates.y, coordinates.z);
        return neighbor ? [neighbor] : [];
    });
}

function diffuseValues(values: CellValues, neighbors: HexagonTile[]): CellValues {
    const average = averageValues(neighbors);
    return {
        moisture: interpolate(values.moisture, average.moisture),
        temperature: interpolate(values.temperature, average.temperature),
        fertility: interpolate(values.fertility, average.fertility),
        elevation: values.elevation,
    };
}

function averageValues(tiles: HexagonTile[]): CellValues {
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

function interpolate(value: number, average: number): number {
    return value + (average - value) * DIFFUSION_RATE;
}

function applyTerrainInfluences(grid: HexagonGrid, changedTileIds: Set<string>): void {
    for (const tile of grid.getAllTiles()) {
        const influence = TerrainDefinitions[tile.terrain].influences;
        if (isEmpty(influence)) {
            continue;
        }
        EeUtils.addCellValues(tile.cellValues, influence);
        changedTileIds.add(tile.id);
    }
}

function isEmpty(values: CellValues): boolean {
    return values.moisture === 0 && values.temperature === 0 && values.fertility === 0 && values.elevation === 0;
}

function incrementTileAges(grid: HexagonGrid, changedTileIds: Set<string>): void {
    for (const tile of grid.getAllTiles()) {
        tile.age += 1;
        changedTileIds.add(tile.id);
    }
}

function resolveTerrains(grid: HexagonGrid, changedTileIds: Set<string>): void {
    for (const tile of grid.getAllTiles()) {
        const terrain = resolveTerrain(tile.cellValues);
        if (terrain === tile.terrain) {
            continue;
        }
        tile.terrain = terrain;
        changedTileIds.add(tile.id);
    }
}

export function resolveTerrain(values: CellValues): TileType {
    return Object.values(TileType).reduce((closest, terrain) => {
        const candidate = TerrainDefinitions[terrain];
        const current = TerrainDefinitions[closest];
        return distance(values, candidate.cellValues) < distance(values, current.cellValues) ? terrain : closest;
    }, TileType.Grass);
}

function distance(left: CellValues, right: CellValues): number {
    return (
        Math.abs(left.moisture - right.moisture) +
        Math.abs(left.temperature - right.temperature) +
        Math.abs(left.fertility - right.fertility) +
        Math.abs(left.elevation - right.elevation)
    );
}

function generateEssence(grid: HexagonGrid, changedTileIds: Set<string>): ElementValues {
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

function evaluateObjectives(): string[] {
    return [];
}
