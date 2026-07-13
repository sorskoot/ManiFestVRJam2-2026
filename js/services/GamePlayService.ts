import {rng} from '@sorskoot/wonderland-components';
import {IGamePlayModel} from '../models/GamePlayModel.ts';
import {Card, CardDefinitions, CardType} from '../types/Card.ts';
import {IConfigService} from './ConfigService.ts';
import {ReadonlySignal, signal} from '@preact/signals-core';
import {HexagonGrid} from '../hexagonmap/HexGrid.ts';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import {TerrainDefinitions} from '../hexagonmap/TerrainDefinition.ts';
import {TileType} from '../hexagonmap/TileType.ts';
import {ITileInteractionService} from './TileInteractionService.ts';
import {EeUtils} from '../utils/EeUtils.ts';
import {EventEmitter} from '../utils/Events.ts';

export interface IGamePlayService {
    hand: ReadonlySignal<Card[]>;
    /**
     * The index of the currently selected card in the hand.
     * If no card is selected, the value is null.
     *
     * TK: Make sure this gets reset when the hand changes.
     */
    currentSelectedCard: ReadonlySignal<number | null>;

    onEndTurn: EventEmitter<[]>;
    getAllTiles(): HexagonTile[];
    startGame(): void;
    getTileById(tileId: string): HexagonTile | undefined;
    selectCard(cardIndex: number): void;
    playSelectedCardOnTile(cardIndex: number, tileId: string): void;
    endTurn(): void;
}

export class GamePlayService implements IGamePlayService {
    public hand = signal<Card[]>([]);
    public currentSelectedCard = signal<number | null>(null);
    public onEndTurn = new EventEmitter<[]>();

    private unplayedCards: Card[] = [];

    private grid?: HexagonGrid;

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
    ) {}

    playSelectedCardOnTile(cardIndex: number, tileId: string): void {
        const card = this.hand.value[cardIndex];
        if (!card) {
            console.warn(`No card found at index ${cardIndex}`);
            return;
        }
        const tile = this.getTileById(tileId);
        if (!tile) {
            console.warn(`No tile found with id ${tileId}`);
            return;
        }
        switch (card.type) {
            case CardType.manipulation:
                EeUtils.addCellValues(tile.cellValues, card.stat);
                break;
        }
        console.log(tile.cellValues);
        this.cardPlayedFromDeck = true;
        this.gamePlayModel.removeCardFromDeck(card);
        this.currentSelectedCard.value = null;
    }

    getTileById(tileId: string): HexagonTile | undefined {
        if (!this.grid) {
            return undefined;
        }
        return this.grid.getTileById(tileId);
    }

    startGame(): void {
        this.createDeck();
        this.createGrid();
    }

    getAllTiles(): HexagonTile[] {
        if (!this.grid) {
            return [];
        }
        return this.grid.getAllTiles();
    }

    createGrid(): void {
        this.grid = new HexagonGrid();
        const center = new HexagonTile(0, 0, 0, TerrainDefinitions[TileType.Grass].cellValues);
        this.grid.addTile(center);
        const newtiles = this.expand(this.grid, [center]);
        this.expand(this.grid, newtiles);
    }

    createDeck(): void {
        this.gamePlayModel.clearDeck();
        for (let i = 0; i < this.configService.getDeckSize(); i++) {
            const card = rng.getItem(CardDefinitions);
            this.gamePlayModel.addCardToDeck(card);
        }

        this.hand.value = this.gamePlayModel.deck.slice(0, this.configService.getHandSize());
        this.currentSelectedCard.value = null;
    }

    selectCard(cardIndex: number): void {
        this.currentSelectedCard.value = cardIndex;
    }

    playCard(card: Card): void {
        this.gamePlayModel.removeCardFromDeck(card);
    }

    endTurn(): void {
        this.hand.value = this.gamePlayModel.deck.slice(0, this.configService.getHandSize());
        this.currentSelectedCard.value = null;
        this.onEndTurn.emit();
    }

    /**
     * Expands the grid by adding new tiles around the given tiles.
     * @param tiles - The tiles to expand around.
     * @returns The newly added tiles.
     */
    private expand(grid: HexagonGrid, tiles: HexagonTile[]): HexagonTile[] {
        const newTiles: HexagonTile[] = [];
        tiles.forEach((tile) => {
            for (const neighborCoords of tile.neighbors()) {
                if (!grid.getTile(neighborCoords.x, neighborCoords.y, neighborCoords.z)) {
                    const newTile = new HexagonTile(neighborCoords.x, neighborCoords.y, neighborCoords.z, {
                        moisture: 5 + rng.getUniformInt(-2, 2),
                        temperature: 5 + rng.getUniformInt(-2, 2),
                        fertility: 5 + rng.getUniformInt(-2, 2),
                        elevation: 5 + rng.getUniformInt(-2, 2),
                    });

                    grid.addTile(newTile);
                    newTiles.push(newTile);
                }
            }
        });
        return newTiles;
    }
}
