import React from 'react';
import {Panel, Text} from '@wonderlandengine/react-ui/components';
import {Column} from '@wonderlandengine/react-ui/components';
import {Align, Justify} from '@wonderlandengine/react-ui';
import {colorSwatch} from '../../utils/colorSwatch.ts';
import {useResourcesViewModel} from './useResourcesViewModel.ts';

export const Resources = () => {
    const vm = useResourcesViewModel();
    return (
        <Column gap={5} width={150}>
            <Panel
                alignContent={Align.Center}
                justifyContent={Justify.Center}
                padding={5}
                rounding={1}
                backgroundColor={colorSwatch.ElementFire}
            >
                <Text textAlign="center" fontSize={16}>{`Fire: ${vm.fire}`}</Text>
            </Panel>
            <Panel
                alignContent={Align.Center}
                justifyContent={Justify.Center}
                padding={5}
                rounding={1}
                backgroundColor={colorSwatch.ElementWater}
            >
                <Text textAlign="center" fontSize={16}>{`Water: ${vm.water}`}</Text>
            </Panel>
            <Panel
                alignContent={Align.Center}
                justifyContent={Justify.Center}
                padding={5}
                rounding={1}
                backgroundColor={colorSwatch.ElementEarth}
            >
                <Text textAlign="center" fontSize={16}>{`Earth: ${vm.earth}`}</Text>
            </Panel>
            <Panel
                alignContent={Align.Center}
                justifyContent={Justify.Center}
                padding={5}
                rounding={1}
                backgroundColor={colorSwatch.ElementAir}
            >
                <Text textAlign="center" fontSize={16}>{`Air: ${vm.air}`}</Text>
            </Panel>
        </Column>
    );
};
