import {Card} from '../types/Card.ts';
import {EventEmitter} from '../utils/Events.ts';
import {GamePlayService} from './GamePlayService.ts';
import {ITileInteractionService} from './TileInteractionService.ts';

export interface IPlayCardService {
    cardPlayed: EventEmitter<[number]>;
}

export class PlayCardService implements IPlayCardService {
    cardPlayed = new EventEmitter<[number]>();

    constructor(
        private gamePlayService: GamePlayService,
        private tileInteractionService: ITileInteractionService
    ) {
        this.tileInteractionService.onTileClick.add(this.onTileClick);
    }

    private onTileClick = (tileId: string) => {
        const selectedCardIndex = this.gamePlayService.currentSelectedCard.value;
        if (selectedCardIndex === null || selectedCardIndex < 0) {
            // no card selected.
            return;
        }

        this.gamePlayService.playSelectedCardOnTile(selectedCardIndex, tileId);
        this.cardPlayed.emit(selectedCardIndex);
    };
}
