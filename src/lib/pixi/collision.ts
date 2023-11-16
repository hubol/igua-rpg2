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
const r1 = new Rectangle();
const r2 = new Rectangle();
const r3 = new Rectangle();
const r4 = new Rectangle();

function clean<TCollideable extends Collideable>(buffer: ResultBuffer) {
    if (buffer.instances)
        buffer.instances.length = 0;
    else
        buffer.instances = [];

    buffer.instance = undefined;
    buffer.collided = false;

    return buffer as CollisionResult<TCollideable>;
}

function isDisplayObject(x: any): x is DisplayObject {
    return x.overlaps;
}

const SkipUpdate = true;

function rectangleCollidesMany<TCollideable extends Collideable>(
        rectangle: IRectangle,
        array: TCollideable[],
        param: FindParam,
        result: CollisionResult<TCollideable>) {
    for (let i = 0; i < array.length; i += 1) {
        const collideable = array[i];
        if  ((isDisplayObject(collideable) && collideable.collides(rectangle))
            || areRectanglesOverlapping(rectangle, collideable as IRectangle)) {
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
        displayObject.getBounds(false, r1);

        return rectangleCollidesMany(r1, array, param, result);
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
                    child.getBounds(SkipUpdate, r1);
                    rectangleCollidesMany(r1, array, param, result);
                    if (param === FindParam.One && result.collided)
                        return result;
                }
            }
        }

        return result;
    },
    displayObjectCollides(displayObject: DisplayObject, rectangle: Collideable) {
        displayObject.getBounds(SkipUpdate, r2);
        if (rectangle.constructor === Container)
            return Collision.containerCollides(rectangle, r2);
        if (rectangle instanceof DisplayObject)
            return areRectanglesOverlapping(r2, rectangle.getBounds(SkipUpdate, r1));
        return areRectanglesOverlapping(r2, rectangle);
    },
    containerCollides(container: Container, other: Collideable) {
        container.getBounds(SkipUpdate, r3);

        if (other instanceof DisplayObject)
            other = other.getBounds(SkipUpdate, r4);

        if (areRectanglesNotOverlapping(r3, other))
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
}

const singleContainer: Container[] = [];