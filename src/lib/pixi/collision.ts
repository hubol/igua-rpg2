import { Container, DisplayObject, Rectangle } from "pixi.js";
import { IRectangle, areRectanglesNotOverlapping, areRectanglesOverlapping } from "../math/rectangle";

export type Collideable = DisplayObject | Rectangle | IRectangle;

export interface CollisionResult<TCollideable extends Collideable> {
    collided: boolean;
    instance: TCollideable;
    instances: TCollideable[];
}

export enum FindParam {
    One = 0,
    All = 1,
}

type ResultBuffer = Partial<CollisionResult<Collideable>>;

const _buffer: ResultBuffer = { instances: [] };

function clean<TCollideable extends Collideable>(buffer: ResultBuffer) {
    if (buffer.instances)
        buffer.instances.length = 0;
    else
        buffer.instances = [];

    buffer.instance = undefined;
    buffer.collided = false;

    return buffer as CollisionResult<TCollideable>;
}

const SkipUpdate = true;

function rectangleCollidesMany<TCollideable extends Collideable>(
        rectangle: IRectangle,
        array: TCollideable[],
        param: FindParam,
        result: CollisionResult<TCollideable>) {
    for (let i = 0; i < array.length; i += 1) {
        const collideable = array[i];
        if (collideable instanceof DisplayObject) {
            if (!collideable.destroyed && collideable.collides(rectangle)) {
                result.collided = true;

                if (param === FindParam.One) {
                    result.instance = collideable;
                    break;
                }

                result.instances.push(collideable);
            }
        }
        else if (areRectanglesOverlapping(rectangle, collideable as IRectangle)) {
                result.collided = true;

                if (param === FindParam.One) {
                    result.instance = collideable;
                    break;
                }

                result.instances.push(collideable);
        }
    }
    return result;
}

const containersToVisit: Container[] = [];

export const Collision = {
    displayObjectCollidesMany<TCollideable extends Collideable>(
            displayObject: DisplayObject,
            array: TCollideable[],
            param: FindParam,
            buffer = _buffer) {
        const result = clean<TCollideable>(buffer);
        const rect = displayObject.getBounds(false, rnew());

        return rectangleCollidesMany(rect, array, param, result);
    },
    containerCollidesMany<TCollideable extends Collideable>(
            container: Container,
            array: TCollideable[],
            param: FindParam,
            buffer = _buffer) {
        const result = clean<TCollideable>(buffer);

        containersToVisit.length = 0;
        containersToVisit.push(container);

        while (containersToVisit.length > 0) {
            const c = containersToVisit.shift()!;
            for (let i = 0; i < c.children.length; i += 1) {
                const child = c.children[i];
                if (child.constructor === Container)
                    containersToVisit.push(child);
                else {
                    const rect = child.getBounds(SkipUpdate, rnew());
                    rectangleCollidesMany(rect, array, param, result);
                    if (param === FindParam.One && result.collided)
                        return result;
                }
            }
        }

        return result;
    },
    displayObjectCollides(displayObject: DisplayObject, rectangle: Collideable) {
        const rect = displayObject.getBounds(SkipUpdate, rnew());
        if (!(rectangle instanceof DisplayObject))
            return areRectanglesOverlapping(rect, rectangle);

        if (rectangle.destroyed)
            return false;

        if (rectangle.constructor === Container)
            return Collision.containerCollides(rectangle, rect);
        return areRectanglesOverlapping(rect, rectangle.getBounds(SkipUpdate, rnew()));
    },
    containerCollides(container: Container, other: Collideable) {
        if (other instanceof DisplayObject) {
            if (other.destroyed)
                return false;
            other = other.getBounds(SkipUpdate, rnew());
        }

        const rect = container.getBounds(SkipUpdate, rnew());

        if (areRectanglesNotOverlapping(rect, other))
            return false;

        if (other.constructor === Container) {
            singleContainer[0] = other;
            return Collision.containerCollidesMany(container, singleContainer, FindParam.One).collided;
        }

        for (let i = 0; i < container.children.length; i += 1) {
            if (container.children[i].collides(other))
                return true;
        }

        return false;
    },
    recycleRectangles() {
        rectangleIndex = 0;
    }
}

const singleContainer: Container[] = [];

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
