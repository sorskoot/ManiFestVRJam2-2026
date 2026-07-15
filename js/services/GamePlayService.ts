import {rng} from '@sorskoot/wonderland-components';
import {IGamePlayModel} from '../models/GamePlayModel.ts';
import {IConfigService} from './ConfigService.ts';
import {ISimulationService} from './SimulationService.ts';
import {ReadonlySignal, signal} from '@preact/signals-core';
import {HexagonGrid} from '../hexagonmap/HexGrid.ts';
import {HexagonTile} from '../hexagonmap/HexagonTile.ts';
import {TerrainDefinitions} from '../hexagonmap/TerrainDefinition.ts';
import {createEmptyElementValues, Element, ElementReserves, ElementValues} from '../hexagonmap/Element.ts';
import {TileType} from '../hexagonmap/TileType.ts';
import {Card, CardDefinitions, CardType} from '../types/Card.ts';
import {TurnResult} from '../types/TurnResult.ts';
import {EeUtils} from '../utils/EeUtils.ts';
import {EventEmitter} from '../utils/Events.ts';

export interface IGamePlayService {
    hand: ReadonlySignal<Card[]>;
    currentSelectedCard: ReadonlySignal<number | null>;
    resources: ReadonlySignal<ElementReserves>;
    turnNumber: ReadonlySignal<number>;

    onEndTurn: EventEmitter<[]>;
    onTurnResolved: EventEmitter<[TurnResult]>;
    onWorldChanged: EventEmitter<[string[]]>;
    getAllTiles(): HexagonTile[];
    startGame(): void;
    getTileById(tileId: string): HexagonTile | undefined;
    selectCard(cardIndex: number): void;
    playSelectedCardOnTile(cardIndex: number, tileId: string): TurnResult;
    endTurn(): void;
}

export class GamePlayService implements IGamePlayService {
    public hand = signal<Card[]>([]);
    public currentSelectedCard = signal<number | null>(null);
    public resources = signal<ElementReserves>(createEmptyElementValues());
    public turnNumber = signal(0);
    public onEndTurn = new EventEmitter<[]>();
    public onTurnResolved = new EventEmitter<[TurnResult]>();
    public onWorldChanged = new EventEmitter<[string[]]>();

    private grid?: HexagonGrid;
    private discardPile: Card[] = [];

    constructor(
        private configService: IConfigService,
        private simulationService: ISimulationService,
        private gamePlayModel: IGamePlayModel
    ) {}

    playSelectedCardOnTile(cardIndex: number, tileId: string): TurnResult {
        const result = this.resolveCardPlay(cardIndex, tileId);
        this.onTurnResolved.emit(result);
        if (result.success) {
            this.onWorldChanged.emit(result.changedTileIds);
        }
        return result;
    }

    private resolveCardPlay(cardIndex: number, tileId: string): TurnResult {
        if (!this.grid) {
            return {success: false, reason: 'no-active-game'};
        }
        const card = this.hand.value[cardIndex];
        if (!card) {
            return {success: false, reason: 'invalid-card'};
        }
        const tile = this.getTileById(tileId);
        if (!tile) {
            return {success: false, reason: 'invalid-target'};
        }
        if (card.type === CardType.expansion) {
            return {success: false, reason: 'unsupported-card'};
        }
        if (!this.canAfford(card.requirements)) {
            return {success: false, reason: 'insufficient-resources'};
        }

        EeUtils.addCellValues(tile.cellValues, card.stat);
        this.simulationService.resolveTerrains(this.grid, new Set([tileId]));
        const resourceChanges = this.payRequirements(card.requirements);

        this.hand.value = this.hand.value.filter((_, index) => index !== cardIndex);
        this.discardPile.push(card);
        this.currentSelectedCard.value = null;
        this.turnNumber.value += 1;
        if (this.hand.value.length === 0) {
            this.drawHand();
        }

        return {
            success: true,
            card,
            targetTileId: tileId,
            changedTileIds: [...new Set([tileId])],
            resourceChanges,
            generatedEssence: {}, //simulation.generatedEssence,
            objectiveChanges: [], //simulation.objectiveChanges,
            turnNumber: this.turnNumber.value,
        };
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
        this.resources.value = this.toElementReserves(this.configService.getStartingResources());
        this.discardPile = [];
        this.turnNumber.value = 0;
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
        // this.expand(this.grid, newtiles);
    }

    createDeck(): void {
        this.gamePlayModel.clearDeck();
        for (let i = 0; i < this.configService.getDeckSize(); i++) {
            const card = rng.getItem(CardDefinitions);
            this.gamePlayModel.addCardToDeck(card);
        }

        this.drawHand();
        this.currentSelectedCard.value = null;
    }

    selectCard(cardIndex: number): void {
        this.currentSelectedCard.value = cardIndex;
    }

    endTurn(): void {
        const simulation = this.simulationService.runSimulation(this.grid!);
        this.addResources(simulation.generatedEssence);
        this.onWorldChanged.emit(simulation.changedTileIds);
        this.gamePlayModel.returnCardsToDeck(this.hand.value);
        this.hand.value = [];
        this.drawHand();
        this.currentSelectedCard.value = null;
        this.onEndTurn.emit();
    }

    private expand(grid: HexagonGrid, tiles: HexagonTile[]): HexagonTile[] {
        const newTiles: HexagonTile[] = [];
        tiles.forEach((tile) => {
            for (const neighborCoords of tile.neighbors()) {
                if (!grid.getTile(neighborCoords.x, neighborCoords.y, neighborCoords.z)) {
                    const cellValues = {
                        moisture: 5 + rng.getUniformInt(-2, 2),
                        temperature: 5 + rng.getUniformInt(-2, 2),
                        fertility: 5 + rng.getUniformInt(-2, 2),
                        elevation: 5 + rng.getUniformInt(-2, 2),
                    };
                    const newTile = new HexagonTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z,
                        cellValues,
                        this.simulationService.resolveTerrain(cellValues)
                    );

                    grid.addTile(newTile);
                    newTiles.push(newTile);
                }
            }
        });
        return newTiles;
    }

    private canAfford(requirements: ElementValues): boolean {
        return Object.values(Element).every((element) => (requirements[element] ?? 0) <= this.resources.value[element]);
    }

    private payRequirements(requirements: ElementValues): ElementValues {
        const resourceChanges = createEmptyElementValues();
        const updatedResources = {...this.resources.value};
        for (const element of Object.values(Element)) {
            const cost = requirements[element] ?? 0;
            updatedResources[element] -= cost;
            resourceChanges[element] = -cost;
        }
        this.resources.value = updatedResources;
        return resourceChanges;
    }

    private toElementReserves(values: ElementValues): ElementReserves {
        const reserves = createEmptyElementValues();
        for (const element of Object.values(Element)) reserves[element] = values[element] ?? 0;
        return reserves;
    }

    private addResources(values: ElementValues): void {
        const updatedResources = {...this.resources.value};
        for (const element of Object.values(Element)) {
            updatedResources[element] += values[element] ?? 0;
        }
        this.resources.value = updatedResources;
    }

    private drawHand(): void {
        this.hand.value = this.gamePlayModel.drawCards(this.configService.getHandSize());
    }
}
