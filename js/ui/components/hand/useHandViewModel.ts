import { useGamePlayService } from "../../GameServicesProvider.tsx";
import { useSignalValue } from "../../hooks/useSignalValue.ts";

export function useCardViewModel() {
    const gamePlayService = useGamePlayService();

    return {
        cards: useSignalValue(gamePlayService.hand),
    }
}