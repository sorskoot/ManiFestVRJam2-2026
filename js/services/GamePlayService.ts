import {rng} from '@sorskoot/wonderland-components';
import {IGamePlayModel} from '../models/GamePlayModel.ts';
import {Card, CardDefinitions} from '../types/Card.ts';
import {IConfigService} from './ConfigService.ts';
import {ReadonlySignal, signal} from '@preact/signals-core';
import { HexagonGrid } from '../hexagonmap/HexGrid.ts';
import { HexagonTile } from '../hexagonmap/HexagonTile.ts';
import { TerrainDefinitions } from '../hexagonmap/TerrainDefinition.ts';
import { TileType } from '../hexagonmap/TileType.ts';

export interface IGamePlayService {
    hand: ReadonlySignal<Card[]>;
    getAllTiles(): HexagonTile[];
    startGame(): void;
}

export class GamePlayService implements IGamePlayService {
    public hand = signal<Card[]>([]);

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
    ) {
       
    }

    startGame(): void {
        this.createDeck();
        this.createGrid();
    };
    
    getAllTiles(): HexagonTile[] {
        if (!this.grid) {
            return [];
        }
        return this.grid.getAllTiles();
    }

    createGrid(): void{
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
    }

    selectCard(card: Card): void {

    }

    playCard(card: Card): void {
        this.gamePlayModel.removeCardFromDeck(card);
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
