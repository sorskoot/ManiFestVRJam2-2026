import {computed, createModel, ReadonlySignal, signal} from '@preact/signals-core';
import {colorSwatch} from '../../utils/colorSwatch.js';

export interface CardState {
    hovered: ReadonlySignal<boolean>;
    pressed: ReadonlySignal<boolean>;
    disabled: ReadonlySignal<boolean>;
    label: ReadonlySignal<string>;

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

export const CardModel = createModel<CardState, [string, boolean | undefined, ((label: string) => void)?]>(
    (label: string = 'Button', isDisabled: boolean = false, onActivate?: (label: string) => void) => {
        const hovered = signal(false);
        const pressed = signal(false);
        const disabled = signal(isDisabled);
        const labelSignal = signal(label);

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
            hovered,
            pressed,
            disabled,
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
