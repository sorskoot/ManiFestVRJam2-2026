import {Element} from './Element.ts';
import type {HexagonTile} from './HexagonTile.ts';
import {TerrainType} from './TerrainType.ts';
import {CellValues} from './CellValues.ts';

export interface TerrainDefinition {
    id: TerrainType;
    influences: CellValues;
    producedElement: Element;
    harvestAmount: number;

    score(cell: HexagonTile): number;
}