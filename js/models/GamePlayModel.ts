import {Card} from '../types/Card.ts';

export interface IGamePlayModel {
    readonly deck: Card[];
    addCardToDeck(card: Card): void;
    removeCardFromDeck(card: Card): void;
    clearDeck(): void;
}
export class GamePlayModel implements IGamePlayModel {
    readonly deck: Card[] = [];

    addCardToDeck(card: Card): void {
        this.deck.push(card);
    }

    removeCardFromDeck(card: Card): void {
        const index = this.deck.indexOf(card);
        if (index > -1) {
            this.deck.splice(index, 1);
        }
    }

    clearDeck(): void {
        this.deck.length = 0;
    }
}
