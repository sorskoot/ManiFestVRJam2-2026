import {Column, Row, Text} from '@wonderlandengine/react-ui/components';
import React, {useState} from 'react';
import {Card} from '../card/card.tsx';
import {Align, Justify, YogaNodeProps} from '@wonderlandengine/react-ui';
import {useHandViewModel} from './useHandViewModel.ts';
import {CardTooltip} from '../card-tooltip/cardTooltip.tsx';

export const Hand = (props: YogaNodeProps) => {
    const vm = useHandViewModel();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    return (
        <Column {...props} gap={10} justifyContent={Justify.Center} alignItems={Align.Center}>
            <Row gap={10} height={100} justifyContent={Justify.Center}>
                {vm.cards.map((card, index) => (
                    <Card
                        onAction={() => vm.selectCard(index)}
                        id={index}
                        key={`${card.title}-${index}`}
                        title={card.title}
                        onHover={() => setHoveredCard(index)}
                        onUnhover={() => setHoveredCard(null)}
                    ></Card>
                ))}
            </Row>
            <CardTooltip card={hoveredCard !== null ? vm.cards[hoveredCard] : null} />
        </Column>
    );
};
