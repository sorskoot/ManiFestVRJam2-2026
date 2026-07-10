import {useSignalValue} from '../../hooks/useSignalValue.js';
import {useCallback} from 'react';
import {CardState} from './CardModel.js';

export function useCardViewModel(model: CardState) {
    const onHover = useCallback(() => model.hover(), [model]);
    const onUnhover = useCallback(() => model.unhover(), [model]);
    const onPress = useCallback(() => model.press(), [model]);
    const onRelease = useCallback(() => model.release(), [model]);
    const onDisable = useCallback(() => model.disable(), [model]);
    const onEnable = useCallback(() => model.enable(), [model]);
    const onClick = useCallback(() => model.click(), [model]);

    return {
        backgroundColor: useSignalValue(model.backgroundColor),
        textColor: useSignalValue(model.textColor),
        hovered: useSignalValue(model.hovered),
        pressed: useSignalValue(model.pressed),
        // label: useSignalValue(model.label),
        onHover,
        onUnhover,
        onPress,
        onRelease,
        onDisable,
        onEnable,
        onClick,
    };
}
