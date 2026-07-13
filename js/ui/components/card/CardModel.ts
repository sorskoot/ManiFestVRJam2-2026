import {computed, createModel, ReadonlySignal, signal} from '@preact/signals-core';
import {colorSwatch} from '../../utils/colorSwatch.js';

export interface CardState {
    hovered: ReadonlySignal<boolean>;
    pressed: ReadonlySignal<boolean>;
    disabled: ReadonlySignal<boolean>;
    selected: ReadonlySignal<boolean>;
    label: ReadonlySignal<string>;
    id: ReadonlySignal<number>;
    backgroundColor: ReadonlySignal<string>;
    textColor: ReadonlySignal<string>;

    hover: () => void;
    unhover: () => void;
    press: () => void;
    release: () => void;
    disable: () => void;
    enable: () => void;
    click: () => void;
}

export const CardModel = createModel<CardState, [number, string, boolean | undefined, ((label: string) => void)?]>(
    (cardId:number, label: string = 'Button', isDisabled: boolean = false, onActivate?: (label: string) => void) => {
        const hovered = signal(false);
        const pressed = signal(false);
        const disabled = signal(isDisabled);
        const labelSignal = signal(label);
        const selected = signal(false);
        const id = signal(-1);
        const backgroundColor = computed(() => {
            const isDisabled = disabled.value;
            return isDisabled
                ? colorSwatch.DisabledButton
                : hovered.value
                  ? colorSwatch.MainButtonHover
                  : colorSwatch.MainButton;
        });

        const textColor = computed(() => {
            const isDisabled = disabled.value;
            return isDisabled ? colorSwatch.DisabledText : hovered.value ? colorSwatch.TextHover : colorSwatch.Text;
        });

        return {
            id,
            hovered,
            pressed,
            disabled,
            selected,
            label: labelSignal,
            backgroundColor,
            textColor,

            hover: () => {
                if (!disabled.value) {
                    hovered.value = true;
                }
            },
            unhover: () => {
                if (!disabled.value) {
                    hovered.value = false;
                }
            },
            press: () => {
                if (!disabled.value) {
                    pressed.value = true;
                }
            },
            release: () => {
                if (!disabled.value) {
                    pressed.value = false;
                }
            },
            disable: () => {
                disabled.value = true;
                hovered.value = false;
                pressed.value = false;
            },
            enable: () => {
                disabled.value = false;
            },
            click: () => {
                if (!disabled.value) {
                    if (onActivate) {
                        onActivate(labelSignal.value);
                    }
                }
            },
        };
    }
);
