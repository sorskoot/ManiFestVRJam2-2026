import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {Cursor} from '@wonderlandengine/components';

export class SwitchCursor extends Component {
    static TypeName = 'switch-cursor';

    declare private cursor: Cursor;

    init() {
        this.cursor = this.object.getComponent(Cursor)!;
        this.cursor.rayCastMode = 0;
    }

    start() {}
}
