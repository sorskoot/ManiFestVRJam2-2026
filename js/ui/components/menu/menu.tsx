import React from 'react';
import {Panel, Row, Text} from '@wonderlandengine/react-ui/components';
import {Hand} from '../hand/hand.tsx';
import {Align, Justify} from '@wonderlandengine/react-ui';
import {colorSwatch} from '../../utils/colorSwatch.ts';
import {useGameFlowService} from '../../GameServicesProvider.tsx';
import {useMenuViewModel} from './useMenuViewModel.ts';

export const Menu = () => {
    const vm = useMenuViewModel();

    return (
        <Row gap={10} width={1000} height={200} justifyContent={Justify.Center} alignItems={Align.Center}>
            <Panel
                onClick={vm.play}
                marginLeft={90}
                height={100}
                width={100}
                rounding={1}
                backgroundColor={colorSwatch.MainButton}
            >
                <Text fontSize={16}>Play</Text>
            </Panel>
        </Row>
    );
};
