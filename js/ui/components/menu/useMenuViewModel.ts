import { useCallback } from "react";
import { useGameFlowService } from "../../GameServicesProvider.tsx";

export function useMenuViewModel() {
    const gameFlowService = useGameFlowService();
    const startGame = useCallback(() => { gameFlowService.startGame() }, [gameFlowService]);
  

    return {
        play: startGame,
    }
}