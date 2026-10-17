import { DisplayObject, Graphics, Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const txsStaff = Tx.Characters.Homunculus.Staves.split({ width: 32 });

const variants = {
    flame: {
        assPivot: [25, 67],
        txs: Tx.Characters.Homunculus.Flame.split({ width: 56 }),
        controlIndices: {
            0: "sine_pivot",
            2: "arms",
            3: "head",
            4: "demo_face",
        },
        staffIndex: 1,
        tints: {
            eyelids: 0xF2CD00,
            mouth: 0x890000,
            pupils: 0x890000,
            primary: 0xF28000,
            secondary: 0xF2CD00,
        },
        name: "Homunculus of Flame",
    },
    earth: {
        assPivot: [25, 46],
        staffIndex: 2,
        txs: Tx.Characters.Homunculus.Earth.split({ width: 56 }),
        controlIndices: {
            1: "arms",
            2: "head",
            3: "demo_face",
        },
        tints: {
            eyelids: 0xBC6F31,
            mouth: 0xDDB99B,
            pupils: 0x7F3D07,
            primary: 0x7F3D07,
            secondary: 0xDDB99B,
        },
        name: "Homunculus of Earth",
    },
    forest: {
        assPivot: [25, 54],
        staffIndex: 0,
        txs: Tx.Characters.Homunculus.Forest.split({ width: 56 }),
        controlIndices: {
            0: "pivot1",
            2: "arms",
            3: "head",
            4: "demo_face",
        },
        tints: {
            eyelids: 0x9E8B48,
            mouth: 0x4B683F,
            pupils: 0x4B683F,
            primary: 0x4B683F,
            secondary: 0x9E8B48,
        },
        name: "Homunculus of the Forest",
    },
    water: {
        assPivot: [26, 55],
        staffIndex: 4,
        txs: Tx.Characters.Homunculus.Water.split({ width: 58 }),
        controlIndices: {
            1: "arms",
            2: "head",
            3: "demo_face",
        },
        tints: {
            eyelids: 0x372C99,
            mouth: 0xffffff,
            pupils: 0x5E76FF,
            primary: 0x372C99,
            secondary: 0x77C2FF,
        },
        name: "Homunculus of Water",
    },
    light: {
        assPivot: [25, 46],
        staffIndex: 5,
        txs: Tx.Characters.Homunculus.Light.split({ width: 56 }),
        controlIndices: {
            1: "arms",
            2: "head",
            3: "demo_face",
        },
        tints: {
            eyelids: 0xC5C8E0,
            mouth: 0x000000,
            pupils: 0x000000,
            primary: 0x5B46A0,
            secondary: 0x9B94F7,
        },
        name: "Homunculus of Light",
    },
    skies: {
        assPivot: [36, 50],
        staffIndex: 3,
        txs: Tx.Characters.Homunculus.Skies.split({ width: 78 }),
        controlIndices: {
            0: "sine_pivot",
            1: "pivot1",
            3: "arms",
            4: "head",
            5: "demo_face",
            6: "pivot1",
        },
        tints: {
            mouth: 0x548DFF,
            pupils: 0x548DFF,
            eyelids: 0x93D0FF,
            primary: 0x93D0FF,
            secondary: 0xffffff,
        },
        name: "Homunculus of the Skies",
    },
} satisfies Record<string, variants.Type>;

namespace variants {
    export type Control = "pivot1" | "sine_pivot" | "head" | "demo_face" | "arms";

    export interface Type {
        assPivot: VectorSimple;
        txs: Texture[];
        controlIndices: Record<string, Control>;
        staffIndex: Integer;
        tints: {
            pupils: RgbInt;
            mouth: RgbInt;
            eyelids: RgbInt;
            primary: RgbInt;
            secondary: RgbInt;
        };
        name: string;
    }
}

const applyControlToSprite: Record<variants.Control, (obj: Sprite, variant: variants.Type) => DisplayObject> = {
    demo_face: (_, variant) => objCharacterHomunculusFace(variant).add(variant.assPivot).add(3, -39),
    head: (obj) => obj.mixin(mxnFacingPivot, { left: -1, right: 1, up: -1, down: 0 }),
    pivot1: (obj) => obj.mixin(mxnBoilPivot.mxnOne),
    sine_pivot: (obj) => obj.mixin(mxnSinePivot),
    arms: (obj) => obj,
};

export function objCharacterHomunculus(id: objCharacterHomunculus.Id) {
    const variant = variants[id];

    const api = {
        hasStaff: true,
    };

    const headObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 16, 12)
        .add(variant.assPivot)
        .add(-5, -50)
        .invisible();

    return container(
        ...variant.txs.map((tx, i) => {
            const sprite = Sprite.from(tx);
            const control = (variant.controlIndices as Record<any, variants.Control>)[i] ?? null;
            if (control === "arms") {
                return container(
                    sprite,
                    Sprite.from(txsStaff[variant.staffIndex])
                        .add(variant.assPivot)
                        .add(-36, -53)
                        .step(self => self.visible = api.hasStaff),
                )
                    .mixin(mxnBoilPivot.mxnOne);
            }
            else if (control) {
                return applyControlToSprite[control](sprite, variant);
            }
            return sprite;
        }),
        headObj,
    )
        .merge({ objCharacterHomunculus: api })
        .mixin(mxnDetectPlayer)
        .mixin(mxnHasHead, { obj: headObj })
        .mixin(mxnSpeaker, {
            name: variant.name,
            tintPrimary: variant.tints.primary,
            tintSecondary: variant.tints.secondary,
        })
        .pivoted(variant.assPivot)
        .zIndexed(ZIndex.CharacterEntities);
}

export namespace objCharacterHomunculus {
    export type Id = keyof typeof variants;
}

objCharacterHomunculus.ids = Object.keys(variants) as objCharacterHomunculus.Id[];

function objCharacterHomunculusFace(variant: variants.Type) {
    return container(
        objAngelEyes({
            defaultEyelidRestingPosition: 0,
            eyelidsTint: variant.tints.eyelids,
            gap: 1,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 0,
            },
            pupilsTint: variant.tints.pupils,
            pupilsTx: Tx.Characters.Homunculus.Pupil,
            scleraTx: Tx.Characters.Homunculus.Sclera,
        }),
        objAngelMouth({
            negativeSpaceTint: variant.tints.mouth,
            teethCount: 1,
            toothGapWidth: 0,
            txs: objAngelMouth.txs.horizontal3,
        })
            .at(-1, 5),
    )
        .mixin(mxnFacingPivot, { left: -2, right: 2, up: -1, down: 0 });
}
