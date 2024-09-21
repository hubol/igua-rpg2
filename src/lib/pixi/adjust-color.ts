// This is an especially gnarly rewrite of a subset of the colord library
// The primary motivation of this mangling was to allocate as few objects as possible
// I also dislike pulling in packages
// This is certainly an example of premature optimization
// But it was fun to make!

// ^_^

const c: WorkingColor = {} as any;

interface WorkingColor {
    rgb: boolean;
    hsv: boolean;
    hsl: boolean;
    r: Float255;
    g: Float255;
    b: Float255;
    h: FloatDegrees;
    s: Float100;
    v: Float100;
    l: Float100;
}

const rgbBuffer = { r: 0, g: 0, b: 0 };
type RgbBuffer = typeof rgbBuffer;

const hsvBuffer = { h: 0, s: 0, v: 0 };
type HsvBuffer = typeof hsvBuffer;

function ensureHsv() {
    if (c.hsv) {
        return;
    }

    if (c.hsl) {
        // https://github.com/omgovich/colord/blob/3f859e03b0ca622eb15480f611371a0f15c9427f/src/colorModels/hsl.ts#L33-L42
        const s = c.s * ((c.l < 50 ? c.l : 100 - c.l) / 100);

        c.s = s > 0 ? ((2 * s) / (c.l + s)) * 100 : 0;
        c.v = c.l + s;
    }
    else if (c.rgb) {
        // https://github.com/omgovich/colord/blob/3f859e03b0ca622eb15480f611371a0f15c9427f/src/colorModels/hsv.ts#L32-L50
        const max = Math.max(c.r, c.g, c.b);
        const delta = max - Math.min(c.r, c.g, c.b);

        const hh = delta
            ? max === c.r
                ? (c.g - c.b) / delta
                : max === c.g
                ? 2 + (c.b - c.r) / delta
                : 4 + (c.r - c.g) / delta
            : 0;

        c.h = 60 * (hh < 0 ? hh + 6 : hh);
        c.s = max ? (delta / max) * 100 : 0;
        c.v = (max / 255) * 100;
    }

    c.hsv = true;
    c.hsl = false;
}

function ensureHsl() {
    if (c.hsl) {
        return;
    }

    ensureHsv();

    // https://github.com/omgovich/colord/blob/3f859e03b0ca622eb15480f611371a0f15c9427f/src/colorModels/hsl.ts#L44-L53
    const hh = ((200 - c.s) * c.v) / 100;

    c.s = hh > 0 && hh < 200 ? ((c.s * c.v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0;
    c.l = hh / 2;

    c.hsl = true;
    c.hsv = false;
}

const matrix: number[] = [];

function ensureRgb() {
    if (c.rgb) {
        return;
    }

    ensureHsv();

    // https://github.com/omgovich/colord/blob/3f859e03b0ca622eb15480f611371a0f15c9427f/src/colorModels/hsv.ts#L52-L69
    const h = (c.h / 360) * 6;
    const s = c.s / 100;
    const v = c.v / 100;

    const hh = Math.floor(h),
        b = v * (1 - s),
        cc = v * (1 - (h - hh) * s),
        d = v * (1 - (1 - h + hh) * s);

    matrix[0] = v;
    matrix[1] = cc;
    matrix[2] = b;
    matrix[3] = b;
    matrix[4] = d;
    matrix[5] = v;

    c.r = matrix[hh % 6] * 255;
    c.g = matrix[(hh + 4) % 6] * 255;
    c.b = matrix[(hh + 2) % 6] * 255;

    c.rgb = true;
}

type Float1 = number;
type Float255 = number;
type Float100 = number;
type FloatDegrees = number;
type PixiColor = number;

const AdjustColorChainer = {
    saturate(amount: Float1) {
        ensureHsl();
        c.hsv = false;
        c.rgb = false;

        c.s = Math.max(0, Math.min(c.s + amount * 100, 100));

        return AdjustColorChainer;
    },
    desaturate(amount: Float1) {
        return AdjustColorChainer.saturate(-amount);
    },
    lighten(amount: Float1) {
        ensureHsl();
        c.hsv = false;
        c.rgb = false;

        c.l = Math.max(0, Math.min(c.l + amount * 100, 100));

        return AdjustColorChainer;
    },
    darken(amount: Float1) {
        return AdjustColorChainer.lighten(-amount);
    },
    toRgb(buffer: {} = rgbBuffer) {
        ensureRgb();

        (<RgbBuffer> buffer).r = c.r;
        (<RgbBuffer> buffer).g = c.g;
        (<RgbBuffer> buffer).b = c.b;
        return buffer as RgbBuffer;
    },
    toHsv(buffer: {} = hsvBuffer) {
        ensureHsv();

        (<HsvBuffer> buffer).h = c.h;
        (<HsvBuffer> buffer).s = c.s;
        (<HsvBuffer> buffer).v = c.v;
        return buffer as HsvBuffer;
    },
    toPixi() {
        ensureRgb();

        return Math.round(c.r) * 65536 + Math.round(c.g) * 256 + Math.round(c.b);
    },
};

export const AdjustColor = {
    rgb(r: Float255, g: Float255, b: Float255) {
        c.rgb = true;
        c.hsv = false;
        c.hsl = false;
        c.r = r;
        c.g = g;
        c.b = b;
        return AdjustColorChainer;
    },
    hsv(h: FloatDegrees, s: Float100, v: Float100) {
        c.rgb = false;
        c.hsv = true;
        c.hsl = false;
        c.h = h;
        c.s = s;
        c.v = v;
        return AdjustColorChainer;
    },
    hsl(h: FloatDegrees, s: Float100, l: Float100) {
        c.rgb = false;
        c.hsv = false;
        c.hsl = true;
        c.h = h;
        c.s = s;
        c.l = l;
        return AdjustColorChainer;
    },
    pixi(src: PixiColor) {
        c.rgb = true;
        c.hsv = false;
        c.hsl = false;
        c.r = Math.floor(src / 65536);
        c.g = Math.floor(src / 256) % 256;
        c.b = src % 256;
        return AdjustColorChainer;
    },
    hex(src: string) {
        return this.pixi(Number.parseInt("0x" + src.replaceAll("#", "")));
    },
};
