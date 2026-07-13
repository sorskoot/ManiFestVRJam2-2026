import {GameFlowService} from './services/GameFlowService.ts';
import {GameEvents} from './services/GameEvents.ts';
import {UiStateService} from './services/UiStateService.ts';
import {serviceLocator} from './utils/ServiceLocator.ts';
import {GamePlayService} from './services/GamePlayService.ts';
import {GamePlayModel} from './models/GamePlayModel.ts';
import {ConfigModel} from './models/ConfigModel.ts';
import {ConfigService} from './services/ConfigService.ts';
import {TileInteractionService} from './services/TileInteractionService.ts';

export const Services = {
    gameFlowService: Symbol('GameFlowService'),
    uiStateService: Symbol('UiStateService'),
    gamePlayService: Symbol('GamePlayService'),
    configService: Symbol('ConfigService'),
    tileInteractionService: Symbol('TileInteractionService'),
    gamePlayModel: Symbol('GamePlayModel'),
    configModel: Symbol('ConfigModel'),
    gameEvents: Symbol('GameEvents'),
};

const gamePlayModel = new GamePlayModel();
const configModel = new ConfigModel();

const uiStateService = new UiStateService();
const configService = new ConfigService(configModel);
const gameEvents = new GameEvents();
const gamePlayService = new GamePlayService(configService, gamePlayModel);
const gameFlowService = new GameFlowService(uiStateService, gamePlayService, gameEvents);
const tileInteractionService = new TileInteractionService();

export function registerServices(): void {
    serviceLocator.registerSingleton(Services.gameFlowService, gameFlowService);
    serviceLocator.registerSingleton(Services.uiStateService, uiStateService);
    serviceLocator.registerSingleton(Services.gamePlayService, gamePlayService);
    serviceLocator.registerSingleton(Services.gamePlayModel, gamePlayModel);
    serviceLocator.registerSingleton(Services.configModel, configModel);
    serviceLocator.registerSingleton(Services.configService, configService);
    serviceLocator.registerSingleton(Services.tileInteractionService, tileInteractionService);
    serviceLocator.registerSingleton(Services.gameEvents, gameEvents);
}

export {gameFlowService, uiStateService, gamePlayService, tileInteractionService};
