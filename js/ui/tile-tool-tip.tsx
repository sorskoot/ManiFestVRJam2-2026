import {Align, Justify, ReactUiBase} from '@wonderlandengine/react-ui';
import React from 'react';
import {Column, Image, MaterialContext, Panel, Row} from '@wonderlandengine/react-ui/components';
import {useSignalValue} from './hooks/useSignalValue.ts';
import {GameServicesProvider, useTileInteractionService} from './GameServicesProvider.tsx';
import {
    gameFlowService,
    uiStateService,
    tileInteractionService,
    gamePlayService,
    playCardService,
} from '../bootstrap-services.ts';
import {UiTexturesManager} from './utils/ui-textures-manager.ts';

const Indicator = (props: {value: number}) => {
    return (
        <Row gap={2} alignItems={Align.FlexStart}>
            {Array.from({length: props.value}, (_, i) => (
                <Panel key={i} rounding={0} width={2} height={10} />
            ))}
        </Row>
    );
};

const ToolTip = (props: {comp: TileToolTipUI}) => {
    const interactionService = useTileInteractionService();

    const tile = useSignalValue(interactionService.currentHoveredTile);

    return (
        <MaterialContext.Provider value={props.comp}>
            <Column gap={2} justifyContent={Justify.FlexStart}>
                <Row alignItems={Align.Center} justifyContent={Justify.FlexStart} padding={1} gap={8}>
                    <Image rounding={0} src={UiTexturesManager.instance.FireIcon} width={20} height={20} />
                    <Indicator value={tile?.cellValues.temperature ?? 0} />
                </Row>
                <Row alignItems={Align.Center} justifyContent={Justify.FlexStart} padding={1} gap={8}>
                    <Image rounding={0} src={UiTexturesManager.instance.WaterIcon} width={20} height={20} />
                    <Indicator value={tile?.cellValues.moisture ?? 0} />
                </Row>
                <Row alignItems={Align.Center} justifyContent={Justify.FlexStart} padding={1} gap={8}>
                    <Image rounding={0} src={UiTexturesManager.instance.EarthIcon} width={20} height={20} />
                    <Indicator value={tile?.cellValues.elevation ?? 0} />
                </Row>
                <Row alignItems={Align.Center} justifyContent={Justify.FlexStart} padding={1} gap={8}>
                    <Image rounding={0} src={UiTexturesManager.instance.AirIcon} width={20} height={20} />
                    <Indicator value={tile?.cellValues.fertility ?? 0} />
                </Row>
            </Column>
        </MaterialContext.Provider>
    );
};

export class TileToolTipUI extends ReactUiBase {
    static TypeName = 'tile-tooltip-ui';
    static InheritProperties = true;

    override update(dt: number) {
        super.update();
    }

    render() {
        return (
            <GameServicesProvider
                services={{
                    gameFlowService,
                    uiStateService,
                    gamePlayService,
                    playCardService,
                    tileInteractionService,
                }}
            >
                <ToolTip comp={this} />
            </GameServicesProvider>
        );
    }
}
