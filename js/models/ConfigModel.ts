export interface IConfigModel {
    readonly deckSize: number;
    readonly handSize: number;
}

export class ConfigModel implements IConfigModel {
    readonly deckSize: number = 12;
    readonly handSize: number = 4;
}
