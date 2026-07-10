import {Align, Justify, ReactUiBase} from '@wonderlandengine/react-ui';
import React from 'react';
import {Column, MaterialContext, Panel, Row, Text} from '@wonderlandengine/react-ui/components';
import {MenuThemeContext, MenuThemeContextValue} from './utils/menu-theme-context.js';
import {colorSwatch} from './utils/colorSwatch.js';
import {useSignalValue} from './hooks/useSignalValue.ts';
import {GameServicesProvider, useGameFlowService} from './GameServicesProvider.tsx';
import {gameFlowService, uiStateService} from '../bootstrap-services.ts';
import {GameState} from '../services/GameFlowService.ts';
import {Card} from './components/card/card.tsx';

const App = (props: {comp: RootUI}) => {
    const gameFlowService = useGameFlowService();

    const gameState = useSignalValue(gameFlowService.gameState);

    const DefaultTheme: MenuThemeContextValue = {
        panel: {
            rounding: 0,
            borderSize: 0,
            padding: 16,
            backgroundColor: colorSwatch.PanelBackground,
        },
        button: {
            rounding: 0,
            width: 120,
            height: 40,
        },
        mainMenuButtonText: {
            fontSize: 10,
        },
    };

    const comp = props.comp;

    return (
        <MaterialContext.Provider value={comp}>
            <MenuThemeContext.Provider value={DefaultTheme}>
                <Row gap={10} width={1000} height={200} justifyContent={Justify.Center} alignItems={Align.Center}>
                    <Card title="Rain"></Card>
                    <Card title="Burn"></Card>
                    <Card title="Water"></Card>

                    <Panel
                        marginLeft={90}
                        height={100}
                        width={100}
                        rounding={1}
                        backgroundColor={colorSwatch.MainButton}
                    >
                        <Text fontSize={16}>Next Turn</Text>
                    </Panel>
                </Row>
                {/* <Column width="100%" height="100%" justifyContent={Justify.Center} alignItems={Align.Center}>
                   {gameState === GameState.Menu && <MainMenuPanel title="Nurikabe WL"></MainMenuPanel>}
                    {gameState === GameState.Completed && <PuzzleCompletedPanel />}
                    {gameState === GameState.Playing && <Hud />}
                </Column>*/}
            </MenuThemeContext.Provider>
        </MaterialContext.Provider>
    );
};

export class RootUI extends ReactUiBase {
    static TypeName = 'root-ui';
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
                }}
            >
                <App comp={this} />
            </GameServicesProvider>
        );
    }
}
