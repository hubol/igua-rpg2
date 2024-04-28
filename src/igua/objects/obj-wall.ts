import { Graphics } from "pixi.js";
import { Vector, vnew } from "../../lib/math/vector-type";
import { Empty } from "../../lib/types/empty";
import { SceneLocal } from "../core/scene/scene-local";
import { Compass } from "../../lib/math/compass";
import { scene } from "../globals";
import { perpendicular } from "../../lib/math/vector";

interface Wall {
    x: number;
    y: number;
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

interface WallsProvider {
    destroyed: boolean;
    wallsDirty: boolean;
    wallsClean?: () => void;
    walls: Wall[];
}

function cleanWalls() {
    const walls = LocalWalls.value;

    let i = 0;
    let shift = 0;

    while (i < walls.length) {
        const wall = walls[i];

        if (wall.destroyed) {
            shift += 1;
            i += 1;
            continue;
        }

        if (wall.wallsDirty)
            wall.wallsClean!();

        if (shift)
            walls[i - shift] = wall;
        i += 1;
    }
}

function createLocalWalls() {
    // TODO enum for stepOrder?!
    scene.root.step(() => cleanWalls(), 999);
    return Empty<WallsProvider>();
}

export const LocalWalls = new SceneLocal(createLocalWalls, 'LocalWalls');

export function objSolidBlock() {
    const n: Wall = { x: 0, y: 0, forward: Compass.East, normal: Compass.North, length: 1, isGround: true };
    const e: Wall = { x: 1, y: 0, forward: Compass.South, normal: Compass.East, length: 1, isWall: true };
    const s: Wall = { x: 1, y: 1, forward: Compass.West, normal: Compass.South, length: 1, isCeiling: true };
    const w: Wall = { x: 0, y: 1, forward: Compass.North, normal: Compass.West, length: 1, isWall: true };

    function wallsClean() {
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

        g.wallsDirty = false;
    }

    const g = new Graphics().merge({ wallsDirty: true, walls: [ n, e, s, w ], wallsClean }).beginFill(0xffffff).drawRect(0, 0, 1, 1);

    const cb = g.transform.position.cb.bind(g.transform);

    g.transform.position.cb = g.transform.scale.cb = () => {
        g.wallsDirty = true;
        cb();
    }

    g.once('added', () => LocalWalls.value.push(g));

    return g;
}

const v = vnew();

// TODO Messy copy-paste
export function objSolidRamp() {
    const ramp: Wall = { x: 0, y: 0, forward: vnew(1, 0), normal: vnew(0, -1), length: 1, isGround: true };
    const side: Wall = { x: 1, y: 0, forward: Compass.South, normal: Compass.East, length: 1, isWall: true };
    const flat: Wall = { x: 1, y: 1, forward: Compass.East, normal: Compass.South, length: 1, isCeiling: true };

    function wallsClean() {
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

        ramp.x = x;
        ramp.y = y + height;
        ramp.forward = ramp.forward.at(scaleX, -scaleY).normalize();
        ramp.normal = perpendicular(ramp.normal.at(scaleX, -scaleY)).normalize();
        ramp.length = v.at(width, height).vlength;

        g.wallsDirty = false;
    }

    const g = new Graphics().merge({ wallsDirty: true, walls: [ ramp, side, flat ], wallsClean }).beginFill(0xffffff).drawPolygon([ 0, 1, 1, 1, 1, 0 ]);

    const cb = g.transform.position.cb.bind(g.transform);

    g.transform.position.cb = g.transform.scale.cb = () => {
        g.wallsDirty = true;
        cb();
    }

    g.once('added', () => LocalWalls.value.push(g));

    return g;
}
