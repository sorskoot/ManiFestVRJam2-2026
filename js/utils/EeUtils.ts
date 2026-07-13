import {CellValues} from '../hexagonmap/CellValues.ts';

function addCellValues(cellValuesA: CellValues, cellValuesB: CellValues): CellValues {
    cellValuesA.moisture += cellValuesB.moisture;
    cellValuesA.temperature += cellValuesB.temperature;
    cellValuesA.fertility += cellValuesB.fertility;
    cellValuesA.elevation += cellValuesB.elevation;
    return cellValuesA;
}

export const EeUtils = {
    addCellValues,
};
