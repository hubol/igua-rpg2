import { normalize } from "./vector";

function Vector(this: Vector, x: number, y: number) {
    this.x = x;
    this.y = y;
}

export function vnew(): Vector;
export function vnew(x: number, y: number): Vector;
export function vnew(vector: Vector): Vector;
export function vnew(x_vector?: number | Vector, y?: number) {
    if (x_vector === undefined)
        return new Vector(0, 0);
    return y === undefined
        ? new Vector((x_vector as Vector).x, (x_vector as Vector).y)
        : new Vector(x_vector as number, y!);
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
        value: function (this: Vector, x_vector: Vector | number, y: number) {
            if (typeof x_vector === "number") {
                this.x = x_vector;
                this.y = y;
            }
            else {
                this.x = x_vector.x;
                this.y = x_vector.y;
            }
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    add: {
        value: function (this: Vector, x_vector: Vector | number, y_scalar?: number) {
            if (typeof x_vector === "number") {
                this.x += x_vector;
                this.y += y_scalar!;
            }
            else if (y_scalar === undefined) {
                this.x += x_vector.x;
                this.y += x_vector.y;
            }
            else {
                this.x += x_vector.x * y_scalar;
                this.y += x_vector.y * y_scalar;
            }
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
    scale: {
        value: function (this: Vector, x_factor: number, y?: number) {
            this.x *= x_factor;
            this.y *= y === undefined ? x_factor : y;
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
