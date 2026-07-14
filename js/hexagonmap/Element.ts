export enum Element {
    Water = 'Water',
    Fire = 'Fire',
    Earth = 'Earth',
    Air = 'Air',
}

export interface ElementValues {
    [Element.Water]?: number;
    [Element.Fire]?: number;
    [Element.Earth]?: number;
    [Element.Air]?: number;
}

export type ElementReserves = Record<Element, number>;

export function createEmptyElementValues(): ElementReserves {
    return {
        [Element.Water]: 0,
        [Element.Fire]: 0,
        [Element.Earth]: 0,
        [Element.Air]: 0,
    };
}
