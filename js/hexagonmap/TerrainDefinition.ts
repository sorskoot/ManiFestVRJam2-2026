import {Element} from './Element.ts';
import {CellValues} from './CellValues.ts';
import {TileType} from './TileType.ts';

export interface TerrainDefinition {
    id: TileType;
    cellValues: CellValues;
    influences: CellValues;
    producedElement?: Element;
}

export const TerrainDefinitions: Record<TileType, TerrainDefinition> = {
    [TileType.Grass]: {
        id: TileType.Grass,
        cellValues: {
            moisture: 5,
            temperature: 5,
            fertility: 5,
            elevation: 2,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
    [TileType.Forest]: {
        id: TileType.Forest,
        cellValues: {
            moisture: 7,
            temperature: 4,
            fertility: 9,
            elevation: 2,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
    [TileType.Hill]: {
        id: TileType.Hill,
        cellValues: {
            moisture: 3,
            temperature: 4,
            fertility: 4,
            elevation: 6,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
    [TileType.Lake]: {
        id: TileType.Lake,
        cellValues: {
            moisture: 10,
            temperature: 4,
            fertility: 1,
            elevation: 0,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
    [TileType.Mountain]: {
        id: TileType.Mountain,
        cellValues: {
            moisture: 3,
            temperature: 2,
            fertility: 2,
            elevation: 10,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
    [TileType.Volcano]: {
        id: TileType.Volcano,
        cellValues: {
            moisture: 2,
            temperature: 10,
            fertility: 1,
            elevation: 9,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
    [TileType.Desert]: {
        id: TileType.Desert,
        cellValues: {
            moisture: 1,
            temperature: 10,
            fertility: 1,
            elevation: 2,
        },
        influences: {
            moisture: 0,
            temperature: 0,
            fertility: 0,
            elevation: 0,
        },
    },
};
