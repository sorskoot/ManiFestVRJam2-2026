import {rng} from '@sorskoot/wonderland-components';
import {IGamePlayModel} from '../models/GamePlayModel.ts';
import {Card, CardDefinitions} from '../types/Card.ts';
import {IConfigService} from './ConfigService.ts';
import {ReadonlySignal, signal} from '@preact/signals-core';

export interface IGamePlayService {
    hand: ReadonlySignal<Card[]>;
}

export class GamePlayService implements IGamePlayService {
    public hand = signal<Card[]>([]);

    private unplayedCards: Card[] = [];

    /**
     * When a card is played, this flag is set to true.
     * It's used to track if the player has played any card during their run through the deck.
     * This can take multiple turns.
     * At the start, the value is set to false.
     * If after all cards have been shown to the player this value is still false,
     * the player can choose a special card and the deck is discarded and a new deck is created.
     */
    private cardPlayedFromDeck = false;

    constructor(
        private configService: IConfigService,
        private gamePlayModel: IGamePlayModel
    ) {
        this.createDeck();
    }

    createDeck(): void {
        this.gamePlayModel.clearDeck();
        for (let i = 0; i < this.configService.getDeckSize(); i++) {
            const card = rng.getItem(CardDefinitions);
            this.gamePlayModel.addCardToDeck(card);
        }

        this.hand.value = this.gamePlayModel.deck.slice(0, this.configService.getHandSize());
    }

    playCard(card: Card): void {
        this.gamePlayModel.removeCardFromDeck(card);
    }
}
