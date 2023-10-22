import { normalize } from "./vector";

function Vector(x: number, y: number) {
    // @ts-ignore
    this.x = x;
    // @ts-ignore
    this.y = y;
}

extendPrototypeAsVector(Vector.prototype);

export function vnew(x: number, y: number): Vector;
export function vnew(vector: Vector): Vector;
export function vnew(xOrVector: number | Vector, y?: number) {
    return typeof xOrVector === 'number'
        ? new Vector(xOrVector, y!)
        : new Vector(xOrVector.x, xOrVector.y);
}

export interface Vector {
    x: number;
    y: number;
    vcpy(): Vector;
    vround(): Vector;
    add(x: number): Vector;
    add(x: number, y: number): Vector;
    add(vector: Vector): Vector;
    add(vector: Vector, scalar: number): Vector;
    normalize(): Vector;
    scale(f: number): Vector;
    scale(x: number, y: number): Vector;
    at(vector: Vector): Vector;
    at(x: number, y: number): Vector;
    vlength: number;
}

export function extendPrototypeAsVector(prototype: unknown) {
    type Properties = Record<keyof Vector, PropertyDescriptor & ThisType<any>>
    Object.defineProperties(prototype, <Properties>{
        vlength: {
            get: function () {
                // @ts-ignore
                return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y,2));
            },
            set: function (l) {
                normalize(this).scale(Math.max(0, l));
            },
            enumerable: false,
            configurable: true,
        },
        at: {
            value: function (x, y) {
                if (typeof x === "number") {
                    this.x = x;
                    this.y = y;
                }
                else {
                    this.x = x.x;
                    this.y = x.y;
                }
                return this;
            },
            enumerable: false,
            configurable: true,
            writable: true,
        },
        add: {
            value: function (...args) {
                const me = this;
    
                if (typeof args[0] === 'object') {
                    const scalar = args[1] ?? 1;
                    me.x += (args[0].x ?? 0) * scalar;
                    me.y += (args[0].y ?? 0) * scalar;
                }
                else {
                    me.x += args[0] ?? 0;
                    me.y += args[1] ?? 0;
                }
                return me;
            },
            enumerable: false,
            configurable: true,
            writable: true,
        },
        scale: {
            value: function (...args) {
                const me = this;
                me.x *= args[0];
                me.y *= args[1] === undefined ? args[0] : args[1];
                return me;
            },
            enumerable: false,
            configurable: true,
            writable: true,
        },
        vcpy: {
            value: function () {
                return { x: this.x, y: this.y };
            },
            enumerable: false,
            configurable: true,
            writable: true,
        },
        vround: {
            value: function () {
                this.x = Math.round(this.x);
                this.y = Math.round(this.y);
                return this;
            },
            enumerable: false,
            configurable: true,
            writable: true,
        },
        normalize: {
            value: function () {
                return normalize(this);
            },
            enumerable: false,
            configurable: true,
            writable: true,
        }
    })
}
