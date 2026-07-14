import {useEffect, useState} from 'react';
import {useGamePlayService} from '../../GameServicesProvider.tsx';
import {useSignalValue} from '../../hooks/useSignalValue.ts';

export function useResourcesViewModel() {
    const gamePlayService = useGamePlayService();
    const resources = useSignalValue(gamePlayService.resources);

    return {
        fire: resources.Fire,
        water: resources.Water,
        earth: resources.Earth,
        air: resources.Air,
    };
}
