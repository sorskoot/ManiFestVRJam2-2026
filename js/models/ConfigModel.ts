import {ElementValues} from '../hexagonmap/Element.ts';

export interface IConfigModel {
    readonly deckSize: number;
    readonly handSize: number;
    readonly startingResources: ElementValues;
    readonly diffusionRate: number;
}

export class ConfigModel implements IConfigModel {
    readonly deckSize: number = 120;
    readonly handSize: number = 4;
    readonly diffusionRate: number = 0.08;
    readonly startingResources: ElementValues = {Water: 20, Fire: 20, Earth: 20, Air: 20};
}
