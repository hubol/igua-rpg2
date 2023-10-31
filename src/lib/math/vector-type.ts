import { normalize } from "./vector";

function Vector(x: number, y: number) {
    // @ts-ignore
    this.x = x;
    // @ts-ignore
    this.y = y;
}

export function vnew(x: number, y: number): Vector;
export function vnew(vector: Vector): Vector;
export function vnew(xOrVector: number | Vector, y?: number) {
    return y === undefined
        ? new Vector((xOrVector as Vector).x, (xOrVector as Vector).y)
        : new Vector(xOrVector as number, y!);
}

export interface Vector {
    x: number;
    y: number;
    vcpy(): Vector;
    vround(): this;
    add(x: number, y: number): this;
    add(vector: Vector): this;
    add(vector: Vector, scalar: number): this;
    normalize(): this;
    scale(f: number): this;
    scale(x: number, y: number): this;
    at(vector: Vector): this;
    at(x: number, y: number): this;
    vlength: number;
}

type PropertyDefinitionShape = Partial<Record<keyof Vector, PropertyDescriptor & ThisType<any>>>
function makePropertyDefinitions<T extends PropertyDefinitionShape>(t: T): T {
    return t;
}

const propertyDefinitions = makePropertyDefinitions({
    vlength: {
        get: function (this: Vector) {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y,2));
        },
        set: function (this: Vector, l) {
            normalize(this).scale(Math.max(0, l));
        },
        enumerable: false,
        configurable: true,
    },
    at: {
        value: function (this: Vector, xOrVector: Vector | number, y: number) {
            if (typeof xOrVector === "number") {
                this.x = xOrVector;
                this.y = y;
            }
            else {
                this.x = xOrVector.x;
                this.y = xOrVector.y;
            }
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    add: {
        value: function (this: Vector, xOrVector: Vector | number, yOrScalar?: number) {
            if (typeof xOrVector === "number") {
                this.x += xOrVector;
                this.y += yOrScalar!;
            }
            else {
                const scalar = yOrScalar ?? 1;
                this.x += xOrVector.x * scalar;
                this.y += xOrVector.y * scalar;
            }
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    scale: {
        value: function (this: Vector, xf: number, y?: number) {
            this.x *= xf;
            this.y *= y === undefined ? xf : y;
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    vcpy: {
        value: function (this: Vector) {
            return vnew(this.x, this.y);
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    vround: {
        value: function (this: Vector) {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    normalize: {
        value: function (this: Vector) {
            return normalize(this);
        },
        enumerable: false,
        configurable: true,
        writable: true,
    }
})

type VectorProperty = keyof typeof propertyDefinitions;

interface DefineVectorPropertiesArgs {
    omit: VectorProperty[];
}

export function defineVectorProperties(prototype: unknown, { omit = [] }: Partial<DefineVectorPropertiesArgs> = {}) {
    const omitSet = new Set(omit);
    const myProperties = { };
    for (const key in propertyDefinitions) {
        if (omitSet.has(key as VectorProperty))
            continue;
        myProperties[key] = propertyDefinitions[key];
    }

    Object.defineProperties(prototype, myProperties);
}

defineVectorProperties(Vector.prototype);
