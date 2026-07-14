import {Component, Texture} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

export class UiTexturesManager extends Component {
    static TypeName = 'ui-textures-manager';

    // Singleton
    private static _instance: UiTexturesManager;
    static get instance(): UiTexturesManager {
        return UiTexturesManager._instance;
    }

    @property.texture()
    declare FireIcon: Texture;

    @property.texture()
    declare WaterIcon: Texture;

    @property.texture()
    declare EarthIcon: Texture;

    @property.texture()
    declare AirIcon: Texture;

    @property.texture()
    declare EndTurn: Texture;

    @property.texture()
    declare StartIcon: Texture;

    init() {
        if (UiTexturesManager._instance) {
            console.error('There can only be one instance of UiTexturesManager Component');
        }
        UiTexturesManager._instance = this;
    }
}
