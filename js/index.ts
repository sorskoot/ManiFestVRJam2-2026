/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 */

/* wle:auto-imports:start */
import {AudioListener} from '@wonderlandengine/components';
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {FingerCursor} from '@wonderlandengine/components';
import {HandTracking} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {PlayerHeight} from '@wonderlandengine/components';
import {VrModeActiveSwitch} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {HexGridLayout} from './components/hex-grid-layout.js';
import {TileHighlight} from './components/tile-highlight.js';
import {TileInteraction} from './components/tile-interaction.js';
import {TilePrefabs} from './components/tile-prefabs.js';
import {RootUI} from './ui/root-ui.tsx';
import {TileToolTipUI} from './ui/tile-tool-tip.tsx';
import {UiTexturesManager} from './ui/utils/ui-textures-manager.js';
/* wle:auto-imports:end */
import {registerServices} from './bootstrap-services.ts';
import {WonderlandEngine} from '@wonderlandengine/api';

export default function (engine: WonderlandEngine) {
    registerServices();
    /* wle:auto-register:start */
engine.registerComponent(AudioListener);
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(FingerCursor);
engine.registerComponent(HandTracking);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlayerHeight);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(HexGridLayout);
engine.registerComponent(TileHighlight);
engine.registerComponent(TileInteraction);
engine.registerComponent(TilePrefabs);
engine.registerComponent(RootUI);
engine.registerComponent(TileToolTipUI);
engine.registerComponent(UiTexturesManager);
/* wle:auto-register:end */
}
