import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { approachLinear } from "../../lib/math/number";
import { ZIndex } from "../core/scene/z-index";
import { objFxPoisonCloud } from "../objects/effects/obj-fx-poison-cloud";
import { playerObj } from "../objects/obj-player";
import { RpgAttack } from "../rpg/rpg-attack";
import { mxnFxSpawnMany } from "./effects/mxn-fx-spawn-many";

export function mxnReleasePoisonGas(obj: DisplayObject) {
    const api = {
        release() {
            fxSpawnState.perFrame = 0.2;
            Sfx.Esoteric.PoisonousDoorOpen.rate(0.95, 1.05).play();
            // TODO should it really skip collision check?
            playerObj.damage(atkPoison);
        },
    };

    const fxSpawnState = {
        perFrame: 0,
        spawnObj: () => objFxPoisonCloud().zIndexed(ZIndex.FrontDecals),
    };

    return obj
        .merge({ mxnReleasePoisonGas: api })
        .mixin(mxnFxSpawnMany, fxSpawnState)
        .step(() => fxSpawnState.perFrame = approachLinear(fxSpawnState.perFrame, 0, 0.2 / 120));
}

const atkPoison = RpgAttack.create({
    conditions: {
        poison: {
            value: 100,
        },
    },
    quirks: {
        ignoreCutscenePlaying: true,
    },
});
