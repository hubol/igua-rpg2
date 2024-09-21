export function nlerp(a: number, b: number, factor: number) {
    return a * (1 - factor) + b * factor;
}

export function approachLinear(a: number, b: number, factor: number) {
    if (a < b) {
        return Math.min(a + factor, b);
    }
    else if (a > b) {
        return Math.max(a - factor, b);
    }
    return b;
}

export function cyclic(number: number, min: number, max: number) {
    number = (number - min) % (max - min);
    if (number < 0) number += max - min;
    return number + min;
}

export function nclamp(x: number, max: number) {
    return Math.sign(x) * Math.min(max, Math.abs(x));
}

export function nsinlerp(x: number, min: number, max: number) {
    return nlerp(min, max, (Math.sin(x) + 1) / 2);
}
