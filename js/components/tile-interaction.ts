import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {CursorTarget} from '@wonderlandengine/components';
import {TileData} from './tile-data.ts';
import {serviceLocator} from '../utils/ServiceLocator.ts';
import {Services} from '../bootstrap-services.ts';
import {ITileInteractionService} from '../services/TileInteractionService.ts';

export class TileInteraction extends Component {
    static TypeName = 'tile-interaction';

    private cursorTarget?: CursorTarget | null;
    private get tileInteractionService() {
        return serviceLocator.get<ITileInteractionService>(Services.tileInteractionService);
    }

    start() {
        this.cursorTarget = this.object.getComponent(CursorTarget);
        if (!this.cursorTarget) {
            console.error('TileInteraction component requires a CursorTarget component on the same object.');
            return;
        }
    }
    onActivate() {
        if (!this.cursorTarget) {
            return;
        }
        this.cursorTarget.onHover.add(this.onHover);
        this.cursorTarget.onUnhover.add(this.onUnhover);
        this.cursorTarget.onClick.add(this.onClick);
    }

    onDeactivate() {
        if (!this.cursorTarget) {
            return;
        }
        this.cursorTarget.onHover.remove(this.onHover);
        this.cursorTarget.onUnhover.remove(this.onUnhover);
        this.cursorTarget.onClick.remove(this.onClick);
    }

    private onHover = (cursor: Object3D) => {
        const tileData = this.object.getComponent(TileData);
        if (!tileData) {
            console.error('TileInteraction component requires a TileData component on the same object.');
            return;
        }
        this.tileInteractionService.emitTileHover(tileData.tileId);
    };

    private onUnhover = (cursor: Object3D) => {
        const tileData = this.object.getComponent(TileData);
        if (!tileData) {
            console.error('TileInteraction component requires a TileData component on the same object.');
            return;
        }
        this.tileInteractionService.emitTileUnhover(tileData.tileId);
    };

    private onClick = (cursor: Object3D) => {
        const tileData = this.object.getComponent(TileData);
        if (!tileData) {
            console.error('TileInteraction component requires a TileData component on the same object.');
            return;
        }
        this.tileInteractionService.emitTileClick(tileData.tileId);
    };
}
