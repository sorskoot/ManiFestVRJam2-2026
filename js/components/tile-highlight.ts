import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { serviceLocator } from '../utils/ServiceLocator.ts';
import { ITileInteractionService } from '../services/TileInteractionService.ts';
import { Services } from '../bootstrap-services.ts';

export class TileHighlight extends Component {
    static TypeName = 'tile-highlight';

    private get tileInteractionService() {
        return serviceLocator.get<ITileInteractionService>(Services.tileInteractionService);
    }

    onActivate() { 
        this.tileInteractionService.onTileHover.add(this.onTileHover);
    }
    onDeactivate() {
        this.tileInteractionService.onTileHover.remove(this.onTileHover);
    }

    private onTileHover = (tileId: string) => {
        console.log('Tile hovered:', tileId);
        // Implement your highlight logic here
    }

}