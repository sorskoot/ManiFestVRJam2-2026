import {Row} from '@wonderlandengine/react-ui/components';
import React from 'react';
import {Card} from '../card/card.tsx';
import {Align, Justify, YogaNodeProps} from '@wonderlandengine/react-ui';
import {useHandViewModel} from './useHandViewModel.ts';

export const Hand = (props: YogaNodeProps) => {
    const vm = useHandViewModel();

    return (
        <Row {...props} gap={10} height={100} justifyContent={Justify.Center}>
            {vm.cards.map((card, index) => (
                <Card
                    onAction={() => vm.selectCard(index)}
                    id={index}
                    key={`${card.title}-${index}`}
                    title={card.title}
                ></Card>
            ))}
        </Row>
    );
};
