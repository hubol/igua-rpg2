import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";

const txsStaff = Tx.Characters.Homunculus.Staves.split({ width: 32 });

const variants = {
    flame: {
        assPivot: [25, 67],
        txs: Tx.Characters.Homunculus.Flame.split({ width: 56 }),
        controlIndices: {
            0: "sine_pivot",
            2: "pivot1",
            3: "head",
            4: "demo_face",
        },
        staffIndex: 1,
    },
    earth: {
        assPivot: [25, 46],
        staffIndex: 2,
        txs: Tx.Characters.Homunculus.Earth.split({ width: 56 }),
        controlIndices: {
            1: "pivot1",
            2: "head",
            3: "demo_face",
        },
    },
    forest: {
        assPivot: [25, 54],
        staffIndex: 0,
        txs: Tx.Characters.Homunculus.Forest.split({ width: 56 }),
        controlIndices: {
            0: "pivot1",
            2: "pivot1",
            3: "head",
            4: "demo_face",
        },
    },
    water: {
        assPivot: [26, 55],
        staffIndex: 4,
        txs: Tx.Characters.Homunculus.Water.split({ width: 58 }),
        controlIndices: {
            1: "pivot1",
            2: "head",
            3: "demo_face",
        },
    },
    light: {
        assPivot: [25, 46],
        staffIndex: 5,
        txs: Tx.Characters.Homunculus.Light.split({ width: 56 }),
        controlIndices: {
            1: "pivot1",
            2: "head",
            3: "demo_face",
        },
    },
    skies: {
        assPivot: [36, 50],
        staffIndex: 3,
        txs: Tx.Characters.Homunculus.Skies.split({ width: 78 }),
        controlIndices: {
            0: "sine_pivot",
            1: "pivot1",
            3: "pivot1",
            4: "head",
            5: "demo_face",
            6: "pivot1",
        },
    },
} satisfies Record<string, variants.Type>;

namespace variants {
    export type Control = "pivot1" | "sine_pivot" | "head" | "demo_face";

    export interface Type {
        assPivot: VectorSimple;
        txs: Texture[];
        controlIndices: Record<string, Control>;
        staffIndex: Integer;
        // TODO name and speaker stuff
    }

    export type Id = keyof typeof variants;
}

const applyControlToSprite: Record<variants.Control, (obj: Sprite) => Sprite> = {
    demo_face: (obj) => obj.mixin(mxnFacingPivot, { left: -2, right: 2, up: -1, down: 0 }),
    head: (obj) => obj.mixin(mxnFacingPivot, { left: -1, right: 1, up: -1, down: 0 }),
    pivot1: (obj) =>
        obj.coro(function* (self) {
            while (true) {
                yield sleep(Rng.intc(250, 666));
                self.pivot.y = self.pivot.y === 0 ? 1 : 0;
            }
        }),
    sine_pivot: (obj) => obj.mixin(mxnSinePivot),
};

export function objCharacterHomunculus(id: variants.Id) {
    const variant = variants[id];
    return container(
        ...variant.txs.map((tx, i) => {
            const sprite = Sprite.from(tx);
            const control = (variant.controlIndices as Record<any, variants.Control>)[i] ?? null;
            if (control) {
                applyControlToSprite[control](sprite);
            }
            return sprite;
        }),
    )
        .pivoted(variant.assPivot)
        .zIndexed(ZIndex.CharacterEntities);
}
