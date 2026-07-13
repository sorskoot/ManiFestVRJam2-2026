import {Component} from '@wonderlandengine/api';
import {serviceLocator} from '../utils/ServiceLocator.ts';
import {ITileInteractionService} from '../services/TileInteractionService.ts';
import {Services} from '../bootstrap-services.ts';

export class TileHighlight extends Component {
    static TypeName = 'tile-highlight';

    private get tileInteractionService() {
        return serviceLocator.get<ITileInteractionService>(Services.tileInteractionService);
    }

    onActivate() {
        this.tileInteractionService.onTileHover.add(this.onTileHover);
        this.tileInteractionService.onTileUnhover.add(this.onTileUnhover);
        this.hide();
    }

    onDeactivate() {
        this.tileInteractionService.onTileHover.remove(this.onTileHover);
        this.tileInteractionService.onTileUnhover.remove(this.onTileUnhover);
        this.hide();
    }

    private onTileHover = (_: string, tilePos: {x: number; y: number}) => {
        this.object.setPositionLocal([tilePos.x, 0, tilePos.y]);
        this.show();
    };

    private onTileUnhover = (_: string) => {
        this.hide();
    };

    private hide() {
        this.object.setScalingLocal([0, 0, 0]);
    }

    private show() {
        this.object.setScalingLocal([1, 1, 1]);
    }
}
