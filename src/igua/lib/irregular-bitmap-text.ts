import { BitmapFont, BitmapText, IBitmapFontCharacter, IBitmapTextStyle, Texture } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";

interface IrregularBitmapFont {
    rng: PseudoRng;
    size: number;
    lineHeight: number;
    chars: Record<string, IrregularBitmapFontCharacter>;
}

const irregularBitmapFonts = new Map<BitmapFont, IrregularBitmapFont>();

function createIrregularBitmapFont(font: BitmapFont): IrregularBitmapFont {
    const oldIrregularBitmapFont = irregularBitmapFonts.get(font);
    if (oldIrregularBitmapFont) {
        return oldIrregularBitmapFont;
    }

    const rng = new PseudoRng();
    const irregularBitmapFont: IrregularBitmapFont = {
        rng,
        size: font.size,
        lineHeight: font.lineHeight,
        chars: Object.entries(font.chars).reduce((object, [key, char]) => {
            object[key] = new IrregularBitmapFontCharacter(char, rng);
            return object;
        }, {}),
    };

    irregularBitmapFonts.set(font, irregularBitmapFont);

    return irregularBitmapFont;
}

class IrregularBitmapFontCharacter implements Omit<IBitmapFontCharacter, "page"> {
    readonly kerning: Record<string, number>;
    readonly texture: Texture;
    readonly xAdvance: number;
    readonly xOffset: number;

    private readonly _yOffset: number;

    constructor(data: IBitmapFontCharacter, readonly rng: PseudoRng) {
        this.kerning = data.kerning;
        this.texture = data.texture;
        this.xAdvance = data.xAdvance;
        this.xOffset = data.xOffset;
        this._yOffset = data.yOffset;
    }

    get yOffset() {
        return this._yOffset + this.rng.intc(1);
    }
}

export class IrregularBitmapText extends BitmapText {
    private _seed: Integer = Rng.int(10000);

    constructor(text: string, style: Partial<IBitmapTextStyle> = {}) {
        super(text, style);
    }

    get seed() {
        return this._seed;
    }

    set seed(value) {
        if (this._seed === value) {
            return;
        }
        this._seed = value;
        this.dirty = true;
    }

    updateText() {
        const bitmapFont = BitmapFont.available[this._fontName];
        const irregularBitmapFont = createIrregularBitmapFont(bitmapFont);
        irregularBitmapFont.rng.seed = this._seed;
        BitmapFont.available[this._fontName] = irregularBitmapFont as unknown as BitmapFont;

        try {
            super.updateText();
        }
        catch (e) {
            throw e;
        }
        finally {
            BitmapFont.available[this._fontName] = bitmapFont;
        }
    }
}
