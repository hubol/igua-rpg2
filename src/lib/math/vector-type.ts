import { moveTowards, normalize } from "./vector";

function Vector(this: Vector, x: number, y: number) {
    this.x = x;
    this.y = y;
}

export interface VectorSimple {
    x: number;
    y: number;
}

export function vnew(): Vector;
export function vnew(x: number, y: number): Vector;
export function vnew(vector: VectorSimple): Vector;
export function vnew(x_vector?: number | VectorSimple, y?: number) {
    if (x_vector === undefined) {
        return new Vector(0, 0);
    }
    return y === undefined
        ? new Vector((x_vector as VectorSimple).x, (x_vector as VectorSimple).y)
        : new Vector(x_vector as number, y!);
}

export interface Vector extends VectorSimple {
    vcpy(): Vector;
    vround(): this;
    vclamp(length: number): this;
    add(x: number, y: number): this;
    add(vector: VectorSimple): this;
    add(vector: VectorSimple, scalar: number): this;
    moveTowards(other: VectorSimple, distance: number): this;
    normalize(): this;
    scale(f: number): this;
    scale(x: number, y: number): this;
    at(vector: VectorSimple): this;
    at(x: number, y: number): this;
    vlength: number;
}

type PropertyDefinitionShape = Partial<Record<keyof Vector, PropertyDescriptor & ThisType<any>>>;
function createPropertyDefinitions<T extends PropertyDefinitionShape>(t: T): T {
    return t;
}

const propertyDefinitions = createPropertyDefinitions({
    vlength: {
        get: function (this: Vector) {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        set: function (this: Vector, l) {
            normalize(this).scale(Math.max(0, l));
        },
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
        configurable: true,
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
        configurable: true,
    },
    moveTowards: {
        value: function (this: Vector, other: Vector, distance: number) {
            return moveTowards(this, other, distance);
        },
        configurable: true,
    },
    scale: {
        value: function (this: Vector, x_factor: number, y?: number) {
            this.x *= x_factor;
            this.y *= y === undefined ? x_factor : y;
            return this;
        },
        configurable: true,
    },
    vcpy: {
        value: function (this: Vector) {
            return vnew(this.x, this.y);
        },
        configurable: true,
    },
    vclamp: {
        value: function (this: Vector, length: number) {
            if (this.vlength > length) {
                return this.normalize().scale(length);
            }
            return this;
        },
        configurable: true,
    },
    vround: {
        value: function (this: Vector) {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        },
        configurable: true,
    },
    normalize: {
        value: function (this: Vector) {
            return normalize(this);
        },
        configurable: true,
    },
});

type VectorProperty = keyof typeof propertyDefinitions;

interface DefineVectorPropertiesArgs {
    omit: VectorProperty[];
}

export function defineVectorProperties(prototype: unknown, { omit = [] }: Partial<DefineVectorPropertiesArgs> = {}) {
    const omitSet = new Set(omit);
    const myProperties = {};
    for (const key in propertyDefinitions) {
        if (omitSet.has(key as VectorProperty)) {
            continue;
        }
        myProperties[key] = propertyDefinitions[key];
    }

    Object.defineProperties(prototype, myProperties);
}

defineVectorProperties(Vector.prototype);
