import { Graphics } from "pixi.js";
import { Vector, vnew } from "../../lib/math/vector-type";
import { Empty } from "../../lib/types/empty";
import { SceneLocal } from "../core/scene/scene-local";
import { Compass } from "../../lib/math/compass";
import { scene } from "../globals";
import { perpendicular } from "../../lib/math/vector";

interface TerrainSegment {
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

function createLocalTerrain() {
    // TODO enum for stepOrder?!
    scene.root.step(() => cleanTerrain(), 999);
    return Empty<Terrain>();
}

export const LocalTerrain = new SceneLocal(createLocalTerrain, 'LocalTerrain');

export function objSolidBlock() {
    const n: TerrainSegment = { x: 0, y: 0, forward: Compass.East, normal: Compass.North, length: 1, isGround: true };
    const e: TerrainSegment = { x: 1, y: 0, forward: Compass.South, normal: Compass.East, length: 1, isWall: true };
    const s: TerrainSegment = { x: 1, y: 1, forward: Compass.West, normal: Compass.South, length: 1, isCeiling: true };
    const w: TerrainSegment = { x: 0, y: 1, forward: Compass.North, normal: Compass.West, length: 1, isWall: true };

    function clean() {
        const scaleX = g.scale.x;
        const scaleY = g.scale.y;
        const x = g.x - Math.max(-scaleX, 0);
        const y = g.y - Math.max(-scaleY, 0);
        const width = Math.abs(scaleX);
        const height = Math.abs(scaleY);

        n.x = x;
        n.y = y;
        n.length = width;

        e.x = x + width;
        e.y = y;
        e.length = height;

        s.x = x + width;
        s.y = y + height;
        s.length = width;

        w.x = x;
        w.y = y + height;
        w.length = height;

        g.dirty = false;
    }

    const g = new Graphics().merge({ dirty: true, segments: [ n, e, s, w ], clean }).beginFill(0xffffff).drawRect(0, 0, 1, 1);

    const cb = g.transform.position.cb.bind(g.transform);

    g.transform.position.cb = g.transform.scale.cb = () => {
        g.dirty = true;
        cb();
    }

    g.once('added', () => LocalTerrain.value.push(g));

    return g;
}

const v = vnew();

// TODO Messy copy-paste
export function objSolidRamp() {
    const ramp: TerrainSegment = { x: 0, y: 0, slope: { forward: Compass.East, width: 1 }, forward: vnew(1, 0), normal: vnew(0, -1), length: 1, isGround: true };
    const side: TerrainSegment = { x: 1, y: 0, forward: Compass.South, normal: Compass.East, length: 1, isWall: true };
    const flat: TerrainSegment = { x: 1, y: 1, forward: Compass.East, normal: Compass.South, length: 1, isCeiling: true };

    function clean() {
        const scaleX = g.scale.x;
        const scaleY = g.scale.y;
        const x = g.x - Math.max(-scaleX, 0);
        const y = g.y - Math.max(-scaleY, 0);
        const width = Math.abs(scaleX);
        const height = Math.abs(scaleY);

        flat.x = x;
        flat.y = y + height;
        flat.length = width;

        side.x = x + width;
        side.y = y;
        side.length = height;

        // TODO: ramp y should always be the maximum of the ramp!
        ramp.x = x;
        ramp.y = y + height;
        ramp.forward = ramp.forward.at(scaleX, -scaleY).normalize();
        ramp.normal = perpendicular(ramp.normal.at(scaleX, -scaleY)).normalize();
        ramp.length = v.at(width, height).vlength;

        ramp.slope!.width = width;

        g.dirty = false;
    }

    const g = new Graphics().merge({ dirty: true, segments: [ ramp, side, flat ], clean }).beginFill(0xffffff).drawPolygon([ 0, 1, 1, 1, 1, 0 ]);

    const cb = g.transform.position.cb.bind(g.transform);

    g.transform.position.cb = g.transform.scale.cb = () => {
        g.dirty = true;
        cb();
    }

    g.once('added', () => LocalTerrain.value.push(g));

    return g;
}
