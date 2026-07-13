import {useEffect, useState} from 'react';
import {Card} from '../../../types/Card.ts';
import {useGamePlayService, usePlayCardService} from '../../GameServicesProvider.tsx';
import {useSignalValue} from '../../hooks/useSignalValue.ts';

export function useHandViewModel() {
    const gamePlayService = useGamePlayService();
    const playCardService = usePlayCardService();

    const selectCard = (cardIndex: number) => {
        gamePlayService.selectCard(cardIndex);
    };
    const [playedCards, setPlayedCards] = useState<number[]>([]);
    // update when a card is played
    useEffect(() => {
        const onCardPlayed = (cardIndex: number) => setPlayedCards((prev) => [...prev, cardIndex]);
        playCardService.cardPlayed.add(onCardPlayed);
        return () => playCardService.cardPlayed.remove(onCardPlayed);
    }, [playCardService]);

    useEffect(() => {
        const onEndTurn = () => {
            setPlayedCards([]);
        };
        gamePlayService.onEndTurn.add(onEndTurn);
        return () => gamePlayService.onEndTurn.remove(onEndTurn);
    }, [gamePlayService]);

    return {
        cards: useSignalValue(gamePlayService.hand),
        selectCard,
        playedCards,
    };
}
