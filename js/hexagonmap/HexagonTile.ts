import {Element, ElementValues} from './Element.ts';
import {TileType} from './TileType.ts';
import {Tags} from './Tags.ts';
import {TILE_SIZE} from './tile-geometry.ts';
import {type CellValues} from './CellValues.ts';
/**
 * Represents a hexagonal tile in a 3D space using cube coordinates.
 */
export class HexagonTile {
    private _id: string;

    public get id(): string {
        return this._id;
    }

    public readonly cellValues: CellValues;
    public readonly influence: CellValues = {
        moisture: 0,
        temperature: 0,
        fertility: 0,
        elevation: 0,
    };

    public readonly harvestElement: Element = Element.Earth;

    public readonly harvestTurns: number = 1;

    // Threshold for manhatten distance
    public readonly stability: number = 2;

    public age: number = 0;

    public terrain: TileType;

    public readonly pendingEssence: ElementValues = {
        [Element.Water]: 0,
        [Element.Fire]: 0,
        [Element.Earth]: 0,
        [Element.Air]: 0,
    };

    /**
     * Creates a new HexagonTile instance.
     * @param x - The x-coordinate in cube coordinates.
     * @param y - The y-coordinate in cube coordinates.
     * @param z - The z-coordinate in cube coordinates.
     */
    constructor(
        public x: number,
        public y: number,
        public z: number,
        startValues: CellValues,
        terrain: TileType = TileType.Grass
    ) {
        this._id = `${x},${y},${z}`;
        this.cellValues = {...startValues};
        this.terrain = terrain;
    }

    /**
     * Calculates the neighboring tiles in cube coordinates.
     * @returns An array of neighboring tiles' cube coordinates.
     */
    public neighbors(): {x: number; y: number; z: number}[] {
        const directions: [number, number, number][] = [
            [1, -1, 0],
            [1, 0, -1],
            [0, 1, -1],
            [-1, 1, 0],
            [-1, 0, 1],
            [0, -1, 1],
        ];
        return directions.map((a) => {
            return {
                x: this.x + a[0],
                y: this.y + a[1],
                z: this.z + a[2],
            };
        });
    }

    /**
     * Converts the cube coordinates of this tile to 2D coordinates.
     * @returns The 2D position of the tile.
     */
    public to2D(): {x: number; y: number} {
        const x2D = TILE_SIZE * Math.sqrt(3) * (this.x + this.z / 2);
        const y2D = TILE_SIZE * (3 / 2) * this.z;
        return {x: x2D, y: y2D};
    }

    /**
     * Converts 2D coordinates to cube coordinates and rounds to the nearest hex tile.
     * @param x2D - The x-coordinate in 2D space.
     * @param y2D - The y-coordinate in 2D space.
     * @returns The cube coordinates of the nearest hex tile.
     */
    public static from2D(x2D: number, y2D: number): {x: number; y: number; z: number} {
        const q = ((x2D * Math.sqrt(3)) / 3 - y2D / 3) / TILE_SIZE;
        const r = (y2D * 2) / 3 / TILE_SIZE;
        const [x, y, z] = HexagonTile.roundCube(q, -q - r, r);
        return {x, y, z};
    }

    /**
     * Rounds cube coordinates to the nearest hex tile.
     * @param x - The x-coordinate in cube space.
     * @param y - The y-coordinate in cube space.
     * @param z - The z-coordinate in cube space.
     * @returns The rounded cube coordinates.
     */
    public static roundCube(x: number, y: number, z: number): [number, number, number] {
        let rx = Math.round(x);
        let ry = Math.round(y);
        let rz = Math.round(z);

        const xDiff = Math.abs(rx - x);
        const yDiff = Math.abs(ry - y);
        const zDiff = Math.abs(rz - z);

        if (xDiff > yDiff && xDiff > zDiff) {
            rx = -ry - rz;
        } else if (yDiff > zDiff) {
            ry = -rx - rz;
        } else {
            rz = -rx - ry;
        }

        return [rx, ry, rz];
    }

    public addTag(tag: string): void {
        Tags.setTag(tag, this._id);
    }

    public hasTag(tag: string): boolean {
        return Tags.hasTag(tag, this._id);
    }

    equals(other: HexagonTile): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
}
