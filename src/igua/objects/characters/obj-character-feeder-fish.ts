import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ZIndex } from "../../core/scene/z-index";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objFigureFlop } from "../figures/obj-figure-flop";

const prng = new PseudoRng();

export function objCharacterFeederFish(seed: Integer) {
    prng.seed = seed;
    const { tint } = objFigureFlop.getPrimitiveArgsFromDexNumber(prng.int(999));

    const collisionObj = new Graphics().beginFill(0xff0000).drawRect(2, 9, 30, 20);

    return container(
        Sprite.from(Tx.Characters.FeederFish.Body)
            .mixin(mxnSinePivot)
            .filtered(new MapRgbFilter(tint.red, tint.green, tint.blue)),
        collisionObj.invisible(),
    )
        .pivoted(14, 24)
        .collisionShape(CollisionShape.DisplayObjects, [collisionObj])
        .zIndexed(ZIndex.CharacterEntities);
}
