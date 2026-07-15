import React from 'react';
import {Column, Panel, Row, Text} from '@wonderlandengine/react-ui/components';
import {Hand} from '../hand/hand.tsx';
import {Align, Justify, YogaNodeProps} from '@wonderlandengine/react-ui';
import {colorSwatch} from '../../utils/colorSwatch.ts';
import {useGamePlayService} from '../../GameServicesProvider.tsx';
import {Resources} from '../resources/resources.tsx';

export const Ingame = (props: YogaNodeProps) => {
    const gamePlayService = useGamePlayService();
    return (
        <Row {...props} gap={10} width={1000} height={200} justifyContent={Justify.Center} alignItems={Align.Center}>
            <Resources />

            <Hand flexGrow={1} />

            <Panel
                onClick={() => gamePlayService.endTurn()}
                marginLeft={90}
                height={100}
                width={100}
                rounding={1}
                backgroundColor={colorSwatch.MainButton}
            >
                <Text fontSize={16}>Next Turn</Text>
            </Panel>
        </Row>
    );
};
