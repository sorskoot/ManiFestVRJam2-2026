import {IConfigModel} from '../models/ConfigModel.ts';

export interface IConfigService {
    getDeckSize(): number;
    getHandSize(): number;
}

export class ConfigService implements IConfigService {
    constructor(private configModel: IConfigModel) {}

    getDeckSize(): number {
        return this.configModel.deckSize;
    }

    getHandSize(): number {
        return this.configModel.handSize;
    }
}
