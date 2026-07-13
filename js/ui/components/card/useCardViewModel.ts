import {useSignalValue} from '../../hooks/useSignalValue.js';
import {useCallback, useEffect, useState} from 'react';
import {CardState} from './CardModel.js';
import { useGamePlayService } from '../../GameServicesProvider.tsx';

import { Card } from '../../../types/Card.ts';

export function useCardViewModel(model: CardState) {
    const onHover = useCallback(() => model.hover(), [model]);
    const onUnhover = useCallback(() => model.unhover(), [model]);
    const onPress = useCallback(() => model.press(), [model]);
    const onRelease = useCallback(() => model.release(), [model]);
    const onDisable = useCallback(() => model.disable(), [model]);
    const onEnable = useCallback(() => model.enable(), [model]);
    const onClick = useCallback(() => model.click(), [model]);

    const gamePlayService = useGamePlayService();
    const [isSelected, setIsSelected] = useState(false);
    useEffect(()=>{
        const unsubscribe = gamePlayService.currentSelectedCard.subscribe((value) => {
            setIsSelected(value === model.id.value);
        });
        return () => unsubscribe();
    }, []);

    // const isSelectedCard = (cardIndex: number) => gamePlayService.currentSelectedCard.value === cardIndex;

    return {
        backgroundColor: useSignalValue(model.backgroundColor),
        textColor: useSignalValue(model.textColor),
        hovered: useSignalValue(model.hovered),
        pressed: useSignalValue(model.pressed),
        selected: useSignalValue(model.selected),
        // label: useSignalValue(model.label),
        isSelected,
        onHover,
        onUnhover,
        onPress,
        onRelease,
        onDisable,
        onEnable,
        onClick,
    };
}
