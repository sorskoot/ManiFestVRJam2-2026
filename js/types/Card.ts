import {CellValues} from '../hexagonmap/CellValues.ts';
import {ElementValues} from '../hexagonmap/Element.ts';

export enum CardType {
    // Influences 1 stat, positive or negative
    manipulation = 'manipulation',

    // adds a new tile to the game
    expansion = 'expansion',

    // Influences multiple stats, positive or negative
    event = 'event',
}

type CardBase = {
    type: CardType;
    title: string;
    requirements: ElementValues;
};

type ManipulationCard = CardBase & {
    type: CardType.manipulation;
    stat: CellValues;
};

type ExpansionCard = CardBase & {
    type: CardType.expansion;
};

type EventCard = CardBase & {
    type: CardType.event;
    stat: CellValues;
};

export type Card = ManipulationCard | ExpansionCard | EventCard;

export const CardDefinitions: Card[] = [
    {
        type: CardType.manipulation,
        title: 'Rain',
        requirements: {Water: 1},
        stat: {moisture: 4, temperature: 0, fertility: 0, elevation: 0},
    },
    {
        type: CardType.manipulation,
        title: 'Drought',
        requirements: {Water: 1},
        stat: {moisture: -4, temperature: 0, fertility: 0, elevation: 0},
    },

    {
        type: CardType.manipulation,
        title: 'Sun',
        requirements: {Fire: 1},
        stat: {moisture: 0, temperature: 4, fertility: 0, elevation: 0},
    },
    {
        type: CardType.manipulation,
        title: 'Moon',
        requirements: {Fire: 1},
        stat: {moisture: 0, temperature: -4, fertility: 0, elevation: 0},
    },

    {
        type: CardType.manipulation,
        title: 'Growth',
        requirements: {Air: 1},
        stat: {moisture: 0, temperature: 0, fertility: 4, elevation: 0},
    },
    {
        type: CardType.manipulation,
        title: 'Decay',
        requirements: {Air: 1},
        stat: {moisture: 0, temperature: 0, fertility: -4, elevation: 0},
    },
    {
        type: CardType.manipulation,
        title: 'Earthquake',
        requirements: {Earth: 1},
        stat: {moisture: 0, temperature: 0, fertility: 0, elevation: 4},
    },
    {
        type: CardType.manipulation,
        title: 'Sinkhole',
        requirements: {Earth: 1},
        stat: {moisture: 0, temperature: 0, fertility: 0, elevation: -4},
    },
    // {
    //     type: CardType.expansion,
    //     title: 'New Land',
    //     requirements: {Water: 1, Fire: 1, Air: 1, Earth: 1},
    // },
];
