import { Component, Material, property } from '@wonderlandengine/api';
import { createContext, useContext } from 'react';

export interface MenuMaterialContextValue {
    windowMaterial: Material;
    buttonMaterial: Material;
    buttonHover: Material;
    buttonColor: Float32Array;
    buttonHoverColor: Float32Array;
}

export interface MenuHudMaterialContextValue {}

export let MenuMaterialContext = createContext<MenuMaterialContextValue | null>(
    null,
);

export let useMenuMaterialContext = () =>
    useContext(MenuMaterialContext) as MenuMaterialContextValue;

export class GuiTexturesManager
    extends Component
    implements MenuMaterialContextValue
{
    /* Properties that are configurable in the editor */
    static TypeName = 'gui-textures-manager';

    // Singleton
    private static _instance: GuiTexturesManager;
    static get instance(): GuiTexturesManager {
        return GuiTexturesManager._instance;
    }

    init() {
        if (GuiTexturesManager._instance) {
            console.error(
                'There can only be one instance of GuiTexturesManager Component',
            );
        }
        GuiTexturesManager._instance = this;
    }

    @property.material()
    declare windowMaterial: Material;

    @property.material()
    declare buttonMaterial: Material;

    @property.material()
    declare buttonHover: Material;

    @property.color(1.0, 1.0, 1.0, 1.0)
    buttonColor = Float32Array.from([1.0, 1.0, 1.0, 1.0]);

    @property.color(1.0, 1.0, 1.0, 1.0)
    buttonHoverColor = Float32Array.from([1.0, 1.0, 1.0, 1.0]);
}
