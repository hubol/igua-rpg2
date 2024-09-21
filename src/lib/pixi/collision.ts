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
    if (buffer.instances) {
        buffer.instances.length = 0;
    }
    else {
        buffer.instances = [];
    }

    buffer.instance = null;
    buffer.collided = false;

    return buffer as CollisionResult<TInstance>;
}

const SkipUpdate = false;

export enum CollisionShape {
    Default = 0,
    Scaled = 1,
    Children = 2,
    DisplayObjects = 3,
}

interface PrivateDisplayObjectCollisionShape {
    _collisionShape?: CollisionShape;
    _collisionShapeDisplayObjects?: DisplayObject[];
    _collisionShapeScale?: Vector;
}

function configureDisplayObject(
    target: DisplayObject & PrivateDisplayObjectCollisionShape,
    shape: CollisionShape,
    scale_xscale_displayObjects?: number | DisplayObject[],
    yscale?: number,
) {
    target._collisionShape = shape;
    if (Array.isArray(scale_xscale_displayObjects)) {
        target._collisionShapeDisplayObjects = scale_xscale_displayObjects;
    }
    else if (typeof scale_xscale_displayObjects === "number") {
        target._collisionShapeScale = vnew(
            scale_xscale_displayObjects,
            typeof yscale === "number" ? yscale : scale_xscale_displayObjects,
        );
    }
}

const sourceGreedyBoundRectangle = new Rectangle();
const sourceBoundRectangles: Rectangle[] = [];
const targetBoundRectangles: Rectangle[] = [];

type Collideable = Container & PrivateDisplayObjectCollisionShape;

function sourceCollidesWithTargets<TInstance>(
    source: Collideable,
    sourceOffset: Vector,
    targets: Collideable[],
    param: FindParam,
    result: CollisionResult<TInstance>,
) {
    if (source.destroyed) {
        return result;
    }

    sourceBoundRectangles.length = 0;
    const pushedRectangleIndexOuter = rectangleIndex;

    accumulateBoundRectanglesOrNotOverlapping(null, source, sourceBoundRectangles);

    for (let i = 0; i < sourceBoundRectangles.length; i += 1) {
        sourceBoundRectangles[i].add(sourceOffset);
    }

    const greedySource = source._collisionShape === CollisionShape.Children
        ? source.getBounds(SkipUpdate, sourceGreedyBoundRectangle).add(sourceOffset)
        : (sourceBoundRectangles.length === 1 ? sourceBoundRectangles[0] : null);

    for (let i = 0; i < targets.length; i += 1) {
        if (targets[i].destroyed) {
            continue;
        }

        const pushedRectangleIndexInner = rectangleIndex;
        targetBoundRectangles.length = 0;

        const notOverlapping = accumulateBoundRectanglesOrNotOverlapping(
            greedySource,
            targets[i],
            targetBoundRectangles,
        );
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
                if (overlapped) {
                    break;
                }
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
    boundRectangles: Rectangle[],
): boolean {
    if (!target._collisionShape || target._collisionShape === CollisionShape.Scaled) {
        const bounds = target.getBounds(SkipUpdate, rnew());
        if (target._collisionShape === CollisionShape.Scaled) {
            // TODO do scaling
        }

        if (greedySource && areRectanglesNotOverlapping(greedySource, bounds)) {
            return true;
        }

        boundRectangles[0] = bounds;
        return false;
    }

    if (
        greedySource && target._collisionShape === CollisionShape.Children
        && areRectanglesNotOverlapping(greedySource, target.getBounds(SkipUpdate, rnew()))
    ) {
        return true;
    }

    const array = target._collisionShape === CollisionShape.Children
        ? target.children
        : target._collisionShapeDisplayObjects!;
    for (let i = 0; i < array.length; i += 1) {
        boundRectangles.push(array[i].getBounds(SkipUpdate, rnew()));
    }

    return false;
}

const singleItemArray: DisplayObject[] = [];

export const _Internal_Collision = {
    configureDisplayObject,
    displayObjectCollidesMany<TDisplayObject extends DisplayObject>(
        source: DisplayObject,
        sourceOffset: Vector,
        targets: TDisplayObject[],
        param: FindParam,
        buffer = _buffer,
    ) {
        const result = clean<TDisplayObject>(buffer);
        return sourceCollidesWithTargets(
            source as Collideable,
            sourceOffset,
            targets as DisplayObject[] as Collideable[],
            param,
            result,
        );
    },
    displayObjectCollides(source: DisplayObject, sourceOffset: Vector, target: DisplayObject) {
        const result = clean(_buffer);
        singleItemArray[0] = target;
        return sourceCollidesWithTargets(
            source as Collideable,
            sourceOffset,
            singleItemArray as Collideable[],
            0,
            result,
        ).collided;
    },
    getCollisionRectangles(source: DisplayObject) {
        const collideable = source as Collideable;
        if (!collideable._collisionShape) {
            return null;
        }
        const result = clean(_buffer);
        singleItemArray[0] = DebugCollideable;
        sourceCollidesWithTargets(collideable, vzero, singleItemArray as Collideable[], 0, result);
        return sourceBoundRectangles;
    },
};

export const Collision = {
    recycleRectangles() {
        rectangleIndex = 0;
    },
};

const vzero = vnew();

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

const DebugCollideable: Collideable = (function () {
    const getBoundsRectangle = new Rectangle(-100_000, -100_000, 0, 0);
    return {
        getBounds() {
            return getBoundsRectangle;
        },
    } as any;
})();
