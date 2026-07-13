import {Row} from '@wonderlandengine/react-ui/components';
import React from 'react';
import {Card} from '../card/card.tsx';
import {Align, Justify} from '@wonderlandengine/react-ui';
import {useHandViewModel} from './useHandViewModel.ts';

export const Hand = () => {
    const vm = useHandViewModel();

    return (
        <Row gap={10} height={100} justifyContent={Justify.Center}>
            {vm.cards.map((card, index) =>
                vm.playedCards.includes(index) ? null : (
                    <Card onAction={() => vm.selectCard(index)} id={index} key={index} title={card.title}></Card>
                )
            )}
        </Row>
    );
};
