import { Graphics } from "pixi.js";
import { Empty } from "../../lib/types/empty";
import { SceneLocal } from "../core/scene/scene-local";
import { scene } from "../globals";

/**
 * Describes a line segment. Different kinds of terrain segments make certain guarantees:
 * - `isFloor` or `isCeiling`: `x0` must always be <= `x1`
 * - `isWallFacingRight` or `isWallFacingLeft`: `y0` must always be <= `y1`
 */
interface TerrainSegmentCoordinates {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

type TerrainSegmentDiscriminator =
      { isFloor:  true;  isCeiling?: false; isWallFacingRight?: false; isWallFacingLeft?: false; isPipe?: boolean; }
    | { isFloor?: false; isCeiling:  true;  isWallFacingRight?: false; isWallFacingLeft?: false; isPipe?: false;   }
    | { isFloor?: false; isCeiling?: false; isWallFacingRight:  true;  isWallFacingLeft?: false; isPipe?: false;   }
    | { isFloor?: false; isCeiling?: false; isWallFacingRight?: false; isWallFacingLeft:  true;  isPipe?: false;   }
type TerrainSegment = TerrainSegmentCoordinates & TerrainSegmentDiscriminator;

interface Terrain {
    destroyed: boolean;
    dirty: boolean;
    clean: () => void;
    segments: TerrainSegment[];
}

function cleanTerrain() {
    const terrains = LocalTerrain.value;

    let i = 0;
    let shift = 0;

    while (i < terrains.length) {
        const wall = terrains[i];

        if (wall.destroyed) {
            shift += 1;
            i += 1;
            continue;
        }

        if (wall.dirty) {
            wall.clean();
            wall.dirty = false;
        }

        if (shift)
            terrains[i - shift] = wall;
        i += 1;
    }
}

function objTerrainSegmentDebug() {
    return new Graphics()
        .step(gfx => {
            gfx.clear();
            for (const terrain of LocalTerrain.value) {
                for (const segment of terrain.segments) {
                    let color = 0xff0000;
                    if (segment.isWallFacingRight)
                        color = 0xffff00;
                    if (segment.isCeiling)
                        color = 0x00ff00;
                    if (segment.isWallFacingLeft)
                        color = 0x0000ff;

                    if (segment.isCeiling || segment.isFloor)
                        gfx.lineStyle(0).beginFill(color, 0.5).drawRect(segment.x0 - 1, segment.y0 - 1, 3, 3);

                    gfx.lineStyle(1, color);
                    gfx.moveTo(segment.x0, segment.y0);
                    gfx.lineTo(segment.x1, segment.y1);
                }
            }
        })
}

function createLocalTerrain() {
    // TODO enum for stepOrder?!
    scene.root.step(() => cleanTerrain(), 999);
    objTerrainSegmentDebug().show(scene.root);
    return Empty<Terrain>();
}

export const LocalTerrain = new SceneLocal(createLocalTerrain, 'LocalTerrain');

export function objSolidBlock() {
    return new SolidBlockGraphics();
}

export function objSolidSlope() {
    return new SolidSlopeGraphics();
}

abstract class TerrainGraphics extends Graphics {
    dirty = true;
    segments: TerrainSegment[] = [];

    constructor(private readonly _weights: TerrainSegment[]) {
        super();

        for (let i = 0; i < _weights.length; i++)
            this.segments.push({ ..._weights[i] });

        const cb = this.transform.position.cb.bind(this.transform);

        this.transform.position.cb = this.transform.scale.cb = () => {
            this.pivot.set(this.transform.scale.x < 0 ? 1 : 0, this.transform.scale.y < 0 ? 1 : 0);
            this.dirty = true;
            cb();
        }

        this.once('added', () => LocalTerrain.value.push(this));
    }

    clean() {
        const xMin = this.x;
        const yMin = this.y;
        const xMax = xMin + Math.abs(this.scale.x);
        const yMax = yMin + Math.abs(this.scale.y);

        const hFlip = this.scale.x < 0;
        const vFlip = this.scale.y < 0;

        const x0 = hFlip ? xMax : xMin;
        const y0 = vFlip ? yMax : yMin;
        const x1 = hFlip ? xMin : xMax;
        const y1 = vFlip ? yMin : yMax;

        for (let i = 0; i < this._weights.length; i++) {
            const segment = this.segments[i];
            const weight = this._weights[i];

            segment.x0 = weight.x0 ? x1 : x0;
            segment.x1 = weight.x1 ? x1 : x0;
            segment.y0 = weight.y0 ? y1 : y0;
            segment.y1 = weight.y1 ? y1 : y0;

            // Normalize to comply with contract described in `TerrainSegmentCoordinates`
            if (((weight.isCeiling || weight.isFloor) && segment.x0 > segment.x1)
                || ((weight.isWallFacingLeft || weight.isWallFacingRight) && segment.y0 > segment.y1)) {
                const x0p = segment.x0;
                const y0p = segment.y0;

                segment.x0 = segment.x1;
                segment.y0 = segment.y1;
                segment.x1 = x0p;
                segment.y1 = y0p;
            }

            segment.isCeiling = (weight.isCeiling && !vFlip) || (weight.isFloor && vFlip);
            segment.isFloor = (weight.isFloor && !vFlip) || (weight.isCeiling && vFlip);

            segment.isWallFacingLeft = (weight.isWallFacingLeft && !hFlip) || (weight.isWallFacingRight && hFlip);
            segment.isWallFacingRight = (weight.isWallFacingRight && !hFlip) || (weight.isWallFacingLeft && hFlip);
        }
    }
}

class SolidBlockGraphics extends TerrainGraphics {
    private static readonly _Weights: TerrainSegment[] = [
        { x0: 0, y0: 0, x1: 1, y1: 0, isFloor: true },
        { x0: 0, y0: 0, x1: 0, y1: 1, isWallFacingLeft: true },
        { x0: 1, y0: 0, x1: 1, y1: 1, isWallFacingRight: true },
        { x0: 0, y0: 1, x1: 1, y1: 1, isCeiling: true }
    ];

    constructor() {
        super(SolidBlockGraphics._Weights);
        this.beginFill(0xffffff).drawRect(0, 0, 1, 1);
    }
}

class SolidSlopeGraphics extends TerrainGraphics {
    private static readonly _Weights: TerrainSegment[] = [
        { x0: 0, y0: 1, x1: 1, y1: 0, isFloor: true },
        { x0: 1, y0: 0, x1: 1, y1: 1, isWallFacingRight: true },
        { x0: 0, y0: 1, x1: 1, y1: 1, isCeiling: true }
    ];

    constructor() {
        super(SolidSlopeGraphics._Weights);
        this.beginFill(0xffffff).drawPolygon([ 0, 1, 1, 1, 1, 0 ]);
    }
}