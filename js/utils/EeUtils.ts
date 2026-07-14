import {Mathf} from '@sorskoot/wonderland-components';
import {CellValues} from '../hexagonmap/CellValues.ts';

function addCellValues(cellValuesA: CellValues, cellValuesB: CellValues): CellValues {
    cellValuesA.moisture += cellValuesB.moisture;
    cellValuesA.temperature += cellValuesB.temperature;
    cellValuesA.fertility += cellValuesB.fertility;
    cellValuesA.elevation += cellValuesB.elevation;
    cellValuesA.moisture = Mathf.clamp(cellValuesA.moisture, 0, 10);
    cellValuesA.temperature = Mathf.clamp(cellValuesA.temperature, 0, 10);
    cellValuesA.fertility = Mathf.clamp(cellValuesA.fertility, 0, 10);
    cellValuesA.elevation = Mathf.clamp(cellValuesA.elevation, 0, 10);
    return cellValuesA;
}

export const EeUtils = {
    addCellValues,
};
