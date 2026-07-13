import React, {createContext, useContext} from 'react';

import type {IGameFlowService} from '../services/GameFlowService.ts';
import type {IUiStateService} from '../services/UiStateService.ts';
import {IGamePlayService} from '../services/GamePlayService.ts';
import {IPlayCardService} from '../services/PlayCardService.ts';

export interface GameServices {
    gameFlowService: IGameFlowService;
    gamePlayService: IGamePlayService;
    playCardService: IPlayCardService;
    uiStateService: IUiStateService;
}

const GameServicesContext = createContext<GameServices | null>(null);

export interface GameServicesProviderProps {
    services: GameServices;
    children: React.ReactNode;
}

export function GameServicesProvider(props: GameServicesProviderProps) {
    return <GameServicesContext.Provider value={props.services}>{props.children}</GameServicesContext.Provider>;
}

export function useGameServices(): GameServices {
    const services = useContext(GameServicesContext);

    if (!services) {
        throw new Error('useGameServices must be used inside GameServicesProvider');
    }

    return services;
}

// Convenience exports for the services
export function useGameFlowService() {
    return useGameServices().gameFlowService;
}

export function useUiStateService() {
    return useGameServices().uiStateService;
}

export function useGamePlayService() {
    return useGameServices().gamePlayService;
}

export function usePlayCardService() {
    return useGameServices().playCardService;
}
