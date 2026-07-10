import React, { useContext } from 'react';
import { createContext } from 'react';
import { Material } from '@wonderlandengine/api';

export interface MenuThemeContextValue {
    panel: {
        borderSize: number;
        rounding: number;
        //  material: Material;
        padding: number;
        backgroundColor: string;
    };
    button: {
        rounding: number;
        width: number;
        height: number;
    };
    mainMenuButtonText: {
        fontSize: number;
    };
}

export const MenuThemeContext = createContext<MenuThemeContextValue | null>(
    null,
);

const BaseThemeSettings = {
    rounding: 0,
};

// Custom hook to use the theme
export const useTheme = () => {
    const context = useContext(MenuThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
