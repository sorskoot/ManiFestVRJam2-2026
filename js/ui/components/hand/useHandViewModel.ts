import {useGamePlayService} from '../../GameServicesProvider.tsx';
import {useSignalValue} from '../../hooks/useSignalValue.ts';

export function useHandViewModel() {
    const gamePlayService = useGamePlayService();

    const selectCard = (cardIndex: number) => {
        gamePlayService.selectCard(cardIndex);
    };

    return {
        cards: useSignalValue(gamePlayService.hand),
        selectCard,
    };
}
