import {Row} from '@wonderlandengine/react-ui/components';
import React from 'react';
import {Card} from '../card/card.tsx';
import {Align, Justify} from '@wonderlandengine/react-ui';
import { useCardViewModel } from './useHandViewModel.ts';

export const Hand = () => {
    const vm = useCardViewModel();

    return (
        <Row gap={10} height={100} justifyContent={Justify.Center}>
            {vm.cards.map((card, index) => (
                <Card key={index} title={card.title}></Card>
            ))}
        </Row>
    );
};
