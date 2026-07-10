/**
 * Downloaded from Lospec.com/palette-list
 * Palette Name: Island Joy 16
 */
const BasePalette = [
    '#ffffff',
    '#6df7c1',
    '#11adc1',
    '#606c81',
    '#393457',
    '#1e8875',
    '#5bb361',
    '#a1e55a',
    '#f7e476',
    '#f99252',
    '#cb4d68',
    '#6a3771',
    '#c92464',
    '#f48cb6',
    '#f7b69e',
    '#9b9c82',
];

export enum ColorName {
    Text,
    TextHover,
    PanelBackground,
    MainButton,
    MainButtonHover,
    MainButtonPressed,
    DisabledButton,
    DisabledText,
}

export const colorSwatch: MenuColors = {
    Text: '#f7e476',
    TextHover: '#ffffff',
    PanelBackground: '#393457',
    MainButton: '#5bb361',
    MainButtonHover: '#1e8875',
    MainButtonPressed: '#1e8875',
    DisabledButton: '#606c81',
    DisabledText: '#393457',
};

type MenuColors = {
    [key in keyof typeof ColorName]: string;
};
