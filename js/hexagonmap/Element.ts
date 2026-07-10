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
