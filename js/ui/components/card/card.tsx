import React, {useState} from 'react';
import {Container, Panel, Text} from '@wonderlandengine/react-ui/components';
import {Align, Justify} from '@wonderlandengine/react-ui';
import {CardModel} from './CardModel.ts';
import {useCardViewModel} from './useCardViewModel.ts';

export const Card = (props: {title: string; id: number; onAction?: (label: string) => void}) => {
    const [model] = useState(() => new CardModel(props.id, props.title, false, props.onAction));
    const vm = useCardViewModel(model);

    return (
        <Container height={110} width={100}>
            <Panel
                height={100}
                width={100}
                rounding={1}
                backgroundColor={vm.backgroundColor}
                borderSize={vm.isSelected ? 4 : 0}
                onClick={vm.onClick}
                onHover={vm.onHover}
                onUnhover={vm.onUnhover}
                alignItems={Align.Center}
                justifyContent={Justify.Center}
            >
                <Text width="100%" textAlign="center" fontSize={12}>
                    {props.title}
                </Text>
            </Panel>
        </Container>
    );
};
