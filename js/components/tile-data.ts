import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';

export class TileData extends Component {
    static TypeName = 'tile-data';
    @property.string()
    public tileId: string = '';
}