import { Container, DisplayObject, Rectangle } from "pixi.js";
import { areRectanglesNotOverlapping, areRectanglesOverlapping } from "../math/rectangle";
import { Vector, vnew } from "../math/vector-type";

interface CollisionResult<TInstance = DisplayObject> {
    collided: boolean;
    instance: TInstance | null;
    instances: TInstance[];
}

enum FindParam {
    One = 0,
    All = 1,
}

type ResultBuffer = Partial<CollisionResult>;

const _buffer: ResultBuffer = { instances: [] };

function clean<TInstance>(buffer: ResultBuffer) {
    if (buffer.instances)
        buffer.instances.length = 0;
    else
        buffer.instances = [];

    buffer.instance = null;
    buffer.collided = false;

    return buffer as CollisionResult<TInstance>;
}

const SkipUpdate = false;

export enum Hitbox {
    Default = 0,
    Scaled = 1,
    Children = 2,
    DisplayObjects = 3,
}

interface PrivateDisplayObjectHitbox {
    _hitbox?: Hitbox;
    _hitboxDisplayObjects?: DisplayObject[];
    _hitboxScale?: Vector;
}

function configureDisplayObject(
    target: DisplayObject & PrivateDisplayObjectHitbox,
    hitbox: Hitbox,
    scale_xscale_displayObjects?: number | DisplayObject[],
    yscale?: number) {
        target._hitbox = hitbox;
        if (Array.isArray(scale_xscale_displayObjects)) {
            target._hitboxDisplayObjects = scale_xscale_displayObjects;
        }
        else if (typeof scale_xscale_displayObjects === 'number') {
            target._hitboxScale = vnew(scale_xscale_displayObjects, typeof yscale === 'number' ? yscale : scale_xscale_displayObjects);
        }
}

const sourceGreedyBoundRectangle = new Rectangle();
const sourceBoundRectangles: Rectangle[] = [];
const targetBoundRectangles: Rectangle[] = [];

type Collideable = Container & PrivateDisplayObjectHitbox;

function sourceCollidesWithTargets<TInstance>(
        source: Collideable,
        targets: Collideable[],
        param: FindParam,
        result: CollisionResult<TInstance>) {
    if (source.destroyed)
        return result;

    sourceBoundRectangles.length = 0;
    const pushedRectangleIndexOuter = rectangleIndex;

    accumulateBoundRectanglesOrNotOverlapping(null, source, sourceBoundRectangles);

    const greedySource = source._hitbox === Hitbox.Children
        ? source.getBounds(SkipUpdate, sourceGreedyBoundRectangle)
        : (sourceBoundRectangles.length === 1 ? sourceBoundRectangles[0] : null);

    for (let i = 0; i < targets.length; i += 1) {
        if (targets[i].destroyed)
            continue;

        const pushedRectangleIndexInner = rectangleIndex;
        targetBoundRectangles.length = 0;

        const notOverlapping = accumulateBoundRectanglesOrNotOverlapping(greedySource, targets[i], targetBoundRectangles);
        if (!notOverlapping) {
            let overlapped = false;
            for (let j = 0; j < sourceBoundRectangles.length; j += 1) {
                for (let k = 0; k < targetBoundRectangles.length; k += 1) {
                    if (areRectanglesOverlapping(sourceBoundRectangles[j], targetBoundRectangles[k])) {
                        result.collided = true;

                        if (param === FindParam.All) {
                            result.instances.push(targets[i] as any);
                            overlapped = true;
                            break;
                        }

                        result.instance = targets[i] as any;
                        rectangleIndex = pushedRectangleIndexOuter;
                        return result;
                    }
                }
                if (overlapped)
                    break;
            }
        }

        rectangleIndex = pushedRectangleIndexInner;
    }

    rectangleIndex = pushedRectangleIndexOuter;
    return result;
}

function accumulateBoundRectanglesOrNotOverlapping(
    greedySource: Rectangle | null,
    target: Collideable,
    boundRectangles: Rectangle[]): boolean {
    if (!target._hitbox || target._hitbox === Hitbox.Scaled) {
        const bounds = target.getBounds(SkipUpdate, rnew());
        if (target._hitbox === Hitbox.Scaled) {
            // TODO do scaling
        }

        if (greedySource && areRectanglesNotOverlapping(greedySource, bounds)) {
            return true;
        }

        boundRectangles[0] = bounds;
        return false;
    }

    if (greedySource && target._hitbox === Hitbox.Children && areRectanglesNotOverlapping(greedySource, target.getBounds(SkipUpdate, rnew()))) {
        return true;
    }

    const array = target._hitbox === Hitbox.Children ? target.children : target._hitboxDisplayObjects!;
    for (let i = 0; i < array.length; i += 1)
        boundRectangles.push(array[i].getBounds(SkipUpdate, rnew()));

    return false;
}

const singleItemArray: DisplayObject[] = [];

export const Collision = {
    configureDisplayObject,
    displayObjectCollidesMany<TDisplayObject extends DisplayObject>(
            displayObject: DisplayObject,
            array: TDisplayObject[],
            param: FindParam,
            buffer = _buffer) {
        const result = clean<TDisplayObject>(buffer);
        return sourceCollidesWithTargets(displayObject as Collideable, array as DisplayObject[] as Collideable[], param, result);
    },
    displayObjectCollides(displayObject: DisplayObject, collideable: DisplayObject) {
        const result = clean(_buffer);
        singleItemArray[0] = collideable;
        return sourceCollidesWithTargets(displayObject as Collideable, singleItemArray as Collideable[], 0, result).collided;
    },
    recycleRectangles() {
        rectangleIndex = 0;
    }
}

let rectangleIndex = 0;
const rectangles: Rectangle[] = [];

function rnew() {
    const rectangle = rectangles[rectangleIndex];
    if (!rectangle) {
        return rectangles[rectangleIndex++] = new Rectangle();
    }
    rectangleIndex += 1;
    return rectangle;
}
