import { Graphics, Sprite, SpriteMaskFilter, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { nlerp } from "../../../lib/math/number";
import { Integer, RgbInt, Unit } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { mxnSpeakingMouth } from "../../mixins/mxn-speaking-mouth";

export interface ObjAngelMouthArgs {
    negativeSpaceTint: RgbInt;
    txs: Texture[];
    teethCount: Integer;
    toothGapWidth: Integer;
}

export function objAngelMouth(args: ObjAngelMouthArgs) {
    if (args.txs.length < 1) {
        throw new Error(`objAngelMouth should be passed txs with length >= 1, got: ${args.txs.length}`);
    }

    const obj = container();

    const { width, height } = args.txs[0];

    let agapeUnit = 0;
    const mouthSpr0 = Sprite.from(args.txs[0]).tinted(args.negativeSpaceTint).show(obj);
    const mouthSpr1 = Sprite.from(args.txs[0]);

    let teethExposedUnit = 0;
    const teethGfx = new Graphics().beginFill(0xffffff).drawRect(0, 0, width, height);

    if (args.teethCount > 0) {
        mouthSpr1.show(obj);
        teethGfx.filtered(new SpriteMaskFilter(mouthSpr1)).show(obj);
        if (args.teethCount > 1) {
            const distance = width / args.teethCount;
            const gapOffsetX = Math.ceil(args.toothGapWidth / 2);
            for (let i = 1; i < args.teethCount; i++) {
                teethGfx.beginFill(args.negativeSpaceTint).drawRect(
                    Math.round(distance * i) - gapOffsetX,
                    0,
                    args.toothGapWidth,
                    height,
                );
            }
        }
    }

    function applyTeethPosition() {
        teethGfx.y = Math.round(nlerp(-height, 0, agapeUnit * teethExposedUnit));
    }

    const controls = {
        get agapeUnit() {
            return agapeUnit;
        },
        set agapeUnit(value) {
            agapeUnit = value;
            const index = value === 0
                ? 0
                : (value === 1
                    ? (args.txs.length - 1)
                    : Math.round(nlerp(Math.min(1, args.txs.length - 1), args.txs.length - 1, value)));
            const texture = args.txs[index];
            mouthSpr0.texture = texture;
            mouthSpr1.texture = texture;
            applyTeethPosition();
        },
        get frowning() {
            return obj.scale.y < 0;
        },
        set frowning(value) {
            if (value) {
                obj.scale.y = Math.abs(obj.scale.y) * -1;
                return;
            }
            obj.scale.y = Math.abs(obj.scale.y);
        },
        get teethExposedUnit() {
            return teethExposedUnit;
        },
        set teethExposedUnit(value) {
            teethExposedUnit = value;
            applyTeethPosition();
        },
    };

    applyTeethPosition();

    return container(obj.pivoted(Math.round(width / 2), Math.round(height / 2)))
        .merge({ controls })
        .mixin(mxnSpeakingMouth, {
            get agapeUnit() {
                return controls.agapeUnit;
            },
            set agapeUnit(value) {
                controls.agapeUnit = value;
            },
        });
}

objAngelMouth.txs = {
    horizontal10: Tx.Enemy.Common.Mouths.Horizontal10.split({ width: 10 }),
    rounded11: Tx.Enemy.Common.Mouths.Rounded11.split({ width: 11 }),
    rounded14: Tx.Enemy.Common.Mouths.Rounded14.split({ width: 14 }),
    w14: Tx.Enemy.Common.Mouths.W14.split({ width: 14 }),
    w14b: Tx.Enemy.Common.Mouths.W14B.split({ width: 14 }),
    w36: Tx.Enemy.Common.Mouths.W36.split({ width: 36 }),
};

export type ObjAngelMouth = ReturnType<typeof objAngelMouth>;
