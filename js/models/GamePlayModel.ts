import {Card} from '../types/Card.ts';

export interface IGamePlayModel {
    readonly deck: Card[];
    addCardToDeck(card: Card): void;
    drawCards(cardCount: number): Card[];
    returnCardsToDeck(cards: Card[]): void;
    clearDeck(): void;
}
export class GamePlayModel implements IGamePlayModel {
    readonly deck: Card[] = [];

    addCardToDeck(card: Card): void {
        this.deck.push(card);
    }

    drawCards(cardCount: number): Card[] {
        return this.deck.splice(0, cardCount);
    }

    returnCardsToDeck(cards: Card[]): void {
        this.deck.push(...cards);
    }

    clearDeck(): void {
        this.deck.length = 0;
    }
}
