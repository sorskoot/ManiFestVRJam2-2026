import React, {useEffect, useState} from 'react';
import {Container, Panel, Text} from '@wonderlandengine/react-ui/components';
import {colorSwatch} from '../../utils/colorSwatch.ts';
import {Align, Justify, PositionType, YogaNodeProps} from '@wonderlandengine/react-ui';
import {CardModel} from './CardModel.ts';
import {useCardViewModel} from './useCardViewModel.ts';
import {rng} from '@sorskoot/wonderland-components';

export const Card = (props: {title: string; onAction?: (label: string) => void}) => {
    const [model] = useState(() => new CardModel(props.title, false, props.onAction));
    const vm = useCardViewModel(model);

    const [hoverMargin, setHoverMargin] = useState(0);
    useEffect(() => {
        setHoverMargin(vm.hovered ? 10 : 0);
        console.log('hovered', vm.hovered);
    }, [vm.hovered]);

    return (
        <Container paddingTop={hoverMargin} height={110} width={100}>
            <Panel
                height={100}
                width={100}
                rounding={1}
                backgroundColor={vm.backgroundColor}
                onClick={vm.onClick}
                onHover={vm.onHover}
                onUnhover={vm.onUnhover}
                alignItems={Align.Center}
                justifyContent={Justify.Center}
            >
                <Text width="100%" textAlign="center" fontSize={20}>
                    {props.title}
                </Text>
            </Panel>
        </Container>
    );
};
