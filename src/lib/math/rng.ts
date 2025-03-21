import { vnew } from "./vector-type";

class RngBase {
    protected random() {
        return Math.random();
    }

    int(max: number): number;
    int(min: number, max: number): number;
    int(min_max: number, max?: number) {
        if (max === undefined) {
            return Math.floor(this.random() * min_max);
        }
        return min_max + Math.floor(this.random() * (max - min_max));
    }

    intc(max: number): number;
    intc(min: number, max: number): number;
    intc(min_max: number, max?: number) {
        if (max === undefined) {
            return Math.round(this.random() * min_max);
        }
        return min_max + Math.round(this.random() * (max - min_max));
    }

    intp(): number {
        return this.random() > 0.5 ? 1 : -1;
    }

    float(): number;
    float(max: number): number;
    float(min: number, max: number): number;
    float(min_max?: number, max?: number) {
        if (min_max === undefined) {
            return this.random();
        }
        if (max === undefined) {
            return this.random() * min_max;
        }
        return min_max + this.random() * (max - min_max);
    }

    bool(): boolean {
        return this.random() > 0.5;
    }

    // TODO just accept an array I think
    choose<T>(...items: T[]): T {
        return items[Math.floor(items.length * this.random())];
    }

    color() {
        return Math.round(this.random() * 0xffffff);
    }

    vunit() {
        const radians = Math.PI * 2 * this.random();
        const v = vnew(Math.cos(radians), Math.sin(radians));
        v.vlength = 1;
        return v;
    }

    // Thank you
    // https://stackoverflow.com/a/12646864
    shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }
}

// https://github.com/tvalentius/pseudo-random/blob/master/index.js
export class PseudoRng extends RngBase {
    public seed: number;

    constructor(seed = Rng.int(8_000_000, 16_000_000)) {
        super();
        this.seed = Math.abs(Math.round(seed) % 2147483647);
    }

    protected random() {
        this.seed = this.seed * 16807 % 2147483647;
        return this.seed / 2147483647;
    }
}

export const Rng = new RngBase();
