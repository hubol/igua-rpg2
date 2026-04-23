import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { DramaInventory } from "../../drama/drama-inventory";
import { ask, show } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { MxnSpeaker, mxnSpeaker } from "../../mixins/mxn-speaker";
import { RpgHotDogs } from "../../rpg/rpg-hot-dogs";

const [
    txButton,
    txBack,
    txKetchup,
    txMustard,
    txRelish,
    txOnion,
    txFront,
] = Tx.Esoteric.HotDogToppingDispenser.split({ width: 44 });

interface CondimentConfig extends MxnSpeaker.Args {
    texture: Texture;
}

const condimentConfigs: Record<RpgHotDogs.CondimentId, CondimentConfig> = {
    ketchup: {
        name: "Ketchup Dispenser",
        texture: txKetchup,
        tintPrimary: 0xFF1B0F,
        tintSecondary: 0xC0C0C0,
    },
    mustard: {
        name: "Mustard Dispenser",
        texture: txMustard,
        tintPrimary: 0xFFD400,
        tintSecondary: 0xC0c0c0,
    },
    onion: {
        name: "Onion Dispenser",
        texture: txOnion,
        tintPrimary: 0xFFFFD9,
        tintSecondary: 0xc0c0c0,
    },
    relish: {
        name: "Relish Dispenser",
        texture: txRelish,
        tintPrimary: 0x62D300,
        tintSecondary: 0xc0c0c0,
    },
};

export function objEsotericHotDogCondimentDispenser(condimentId: RpgHotDogs.CondimentId) {
    const buttonObj = Sprite.from(txButton);
    const config = condimentConfigs[condimentId] ?? condimentConfigs.ketchup;

    return container(
        buttonObj,
        Sprite.from(txBack),
        Sprite.from(config.texture),
        Sprite.from(txFront),
    )
        .pivoted(22, 29)
        .mixin(mxnSpeaker, config)
        .mixin(mxnCutscene, function* () {
            yield* show("Dispenses condiments.");
            if (!(yield* ask("Use it on your hot dog?"))) {
                return;
            }
            yield* DramaInventory.potions.addCondimentToHotDog(
                condimentId,
                (function* () {
                    // TODO SFX
                    yield interpvr(buttonObj).translate(0, 5).over(100);
                    yield sleep(300);
                    yield interpvr(buttonObj).factor(factor.sine).to(0, 0).over(250);
                })(),
            );
        })
        .zIndexed(ZIndex.Entities);
}
