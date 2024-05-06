import { Graphics } from "pixi.js";
import { Vector, vnew } from "../../lib/math/vector-type";
import { Empty } from "../../lib/types/empty";
import { SceneLocal } from "../core/scene/scene-local";
import { Compass } from "../../lib/math/compass";
import { scene } from "../globals";
import { perpendicular } from "../../lib/math/vector";
import { nlerp } from "../../lib/math/number";

interface TerrainSegmentCoordinates {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

type TerrainSegmentDiscriminator =
      { isFloor:  true;  isCeiling?: false; isWallFacingRight?: false; isWallFacingLeft?: false; }
    | { isFloor?: false; isCeiling:  true;  isWallFacingRight?: false; isWallFacingLeft?: false; }
    | { isFloor?: false; isCeiling?: false; isWallFacingRight:  true;  isWallFacingLeft?: false; }
    | { isFloor?: false; isCeiling?: false; isWallFacingRight?: false; isWallFacingLeft:  true;  }
type TerrainSegment = TerrainSegmentCoordinates & TerrainSegmentDiscriminator;

interface TerrainSegment_old {
    x: number;
    y: number;
    slope?: {
        forward: Vector;
        width: number;
    };
    forward: Vector;
    normal: Vector;
    length: number;
    // TODO determine what properties are necessary
    isGround?: boolean;
    isCeiling?: boolean;
    isWall?: boolean;
    isPipe?: boolean;
    active?: boolean;
}

interface Terrain {
    destroyed: boolean;
    dirty: boolean;
    clean?: () => void;
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

        if (wall.dirty)
            wall.clean!();

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

export function objSolidRamp() {
    return new SolidRampGraphics();
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
            this.dirty = true;
            cb();
        }

        this.once('added', () => LocalTerrain.value.push(this));
    }

    clean() {
        const scaleX = this.scale.x;
        const scaleY = this.scale.y;
        const x0 = this.x - Math.max(-scaleX, 0);
        const y0 = this.y - Math.max(-scaleY, 0);
        const x1 = x0 + Math.abs(scaleX);
        const y1 = y0 + Math.abs(scaleY);

        for (let i = 0; i < this._weights.length; i++) {
            const segment = this.segments[i];
            const weight = this._weights[i];

            segment.x0 = weight.x0 ? x1 : x0;
            segment.x1 = weight.x1 ? x1 : x0;
            segment.y0 = weight.y0 ? y1 : y0;
            segment.y1 = weight.y1 ? y1 : y0;
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

class SolidRampGraphics extends TerrainGraphics {
    private static readonly _Weights: TerrainSegment[] = [
        { x0: 0, y0: 1, x1: 1, y1: 0, isFloor: true },
        { x0: 1, y0: 0, x1: 1, y1: 1, isWallFacingRight: true },
        { x0: 0, y0: 1, x1: 1, y1: 1, isCeiling: true }
    ];

    constructor() {
        super(SolidRampGraphics._Weights);
        this.beginFill(0xffffff).drawPolygon([ 0, 1, 1, 1, 1, 0 ]);
    }

    clean() {
        super.clean();
        const isWallFacingRight = this.scale.x > 0;
        this.segments[1].isWallFacingRight = isWallFacingRight;
        this.segments[1].isWallFacingLeft = !isWallFacingRight;

        const isFloorRamp = this.scale.y > 0;
        this.segments[0].isFloor = isFloorRamp;
        this.segments[0].isCeiling = !isFloorRamp;

        this.segments[2].isCeiling = isFloorRamp;
        this.segments[2].isFloor = !isFloorRamp;
    }
}