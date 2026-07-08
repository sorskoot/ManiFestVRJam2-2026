/**
 * BillboardingComponent
 *
 * Makes the attached object face the active camera each frame.
 *
 * Behavior:
 * - When `yAlwaysUp` is true (default), the object rotates to face the camera
 *   only around the Y axis so the object's vertical orientation remains stable.
 * - When `yAlwaysUp` is false, the object fully looks at the camera (all axes).
 * - When `flipY` is true (default), the object is rotated 180 degrees around Y
 *   after the lookAt step—useful when the object's front faces the opposite
 *   direction of the mesh.
 *
 */
import {Component, Mesh, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

import {vec3} from 'gl-matrix';

const tempVec1 = vec3.create();
const tempVec2 = vec3.create();

export class BillboardingComponent extends Component {
    static TypeName = 'billboarding-component';

    @property.bool(true)
    /**
     * When true, only rotate the object around the Y axis so 'up' stays fixed.
     * Default: `true`.
     */
    yAlwaysUp = true;

    @property.bool(true)
    /**
     * When true, rotate the object 180 degrees around the Y axis after looking
     * at the camera. Useful when meshes face the opposite direction.
     * Default: `true`.
     */
    flipY = true;

    update(dt: number) {
        // Get camera world position (first active view)
        const cam = this.engine.scene.activeViews[0].object;
        cam.getPositionWorld(tempVec1);

        if (this.yAlwaysUp) {
            this.object.getPositionWorld(tempVec2);
            this.object.lookAt([tempVec1[0], tempVec2[1], tempVec1[2]]);
        } else {
            this.object.lookAt([tempVec1[0], tempVec1[1], tempVec1[2]]);
        }
        if (this.flipY) {
            this.object.rotateAxisAngleDegObject([0, 1, 0], 180);
        }
    }
}
