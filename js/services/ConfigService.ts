import {IConfigModel} from '../models/ConfigModel.ts';
import {ElementValues} from '../hexagonmap/Element.ts';

export interface IConfigService {
    getDeckSize(): number;
    getHandSize(): number;
    getStartingResources(): ElementValues;
}

export class ConfigService implements IConfigService {
    constructor(private configModel: IConfigModel) {}

    getDeckSize(): number {
        return this.configModel.deckSize;
    }

    getHandSize(): number {
        return this.configModel.handSize;
    }

    getStartingResources(): ElementValues {
        return {...this.configModel.startingResources};
    }
}
