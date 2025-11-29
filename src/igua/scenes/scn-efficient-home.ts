import { BLEND_MODES } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { DataNpcPersona } from "../data/data-npc-persona";
import { ask, show } from "../drama/show";
import { layers, scene } from "../globals";
import { mxnFxAlphaVisibility } from "../mixins/effects/mxn-fx-alpha-visibility";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objEsotericArt } from "../objects/esoteric/obj-esoteric-art";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnEfficientHome() {
    scene.camera.defaultMode = "controlled";
    const lvl = Lvl.EfficientHome();
    scene.camera.at(Math.floor(playerObj.x / 512) * 512, Math.floor(playerObj.y / 288) * 288);

    enrichHelium(lvl);
    enrichRoom0(lvl);
    enrichRoom1(lvl);
    enrichRoom2(lvl);
}

function enrichHelium(lvl: LvlType.EfficientHome) {
    [lvl.HeliumMarker0, lvl.HeliumMarker1, lvl.HeliumMarker2].forEach((obj, index) =>
        objHeliumExhaust()
            .step(self => self.isAttackActive = Rpg.character.status.conditions.helium.ballons.length === index, -1)
            .at(obj)
            .show()
    );
}

function enrichRoom0(lvl: LvlType.EfficientHome) {
    const artObj = container()
        .coro(function* (self) {
            while (true) {
                const seed = Rpg.flags.greatTower.efficientHome.artSeed;

                self.removeAllChildren();
                if (seed !== null) {
                    objEsotericArt(seed).show(self);
                }
                // TODO types could be improved maybe?
                yield onPrimitiveMutate(() => Rpg.flags.greatTower.efficientHome.artSeed ?? -1);
            }
        })
        .at(lvl.ArtRegion)
        .zIndexed(ZIndex.BackgroundDecals)
        .show();

    lvl.CloudHouseNpc0.mixin(mxnCutscene, function* () {
        yield* ask("You can't tell, but right now I'm working on my art.", "You are?");
        yield* show("Yep, I'm dreaming up big ideas...");
        yield sleep(1000);
        yield* show("Oh! Here's an idea now.");
        yield interpvr(artObj.pivot).factor(factor.sine).translate(0, -280).over(artObj.children.length ? 1000 : 0);
        Rpg.flags.greatTower.efficientHome.artSeed = Rng.intc(0, Number.MAX_SAFE_INTEGER / 2);
        yield interpvr(artObj.pivot).factor(factor.sine).to(0, 0).over(500);
        artObj.pivot.y = 0;
    });
}

function enrichRoom1(lvl: LvlType.EfficientHome) {
    lvl.CloudHouseAddictNpc.mixin(mxnCutscene, function* () {
        yield* show("I love foam insulation!");
        layers.overlay.solidBelowMessages.blendMode = BLEND_MODES.SUBTRACT;
        yield sleep(400);
        yield layers.overlay.solidBelowMessages.fadeIn(500);
        yield sleep(1000);

        const textObjs = container().at(40, 40).show(layers.overlay.messages);

        const textObj0 = objText.Medium(
            `${lvl.CloudHouseAddictNpc.speaker.name} is addicted to eating foam insulation.`,
        )
            .mixin(mxnFxAlphaVisibility, false)
            .show(textObjs);

        textObj0.mxnFxAlphaVisibility.visible = true;

        yield sleep(2500);

        const textObj1 = objText.Medium(
            `Last year, ${lvl.CloudHouseAddictNpc.speaker.name} ate 150,000 gallon-pounts of foam insulation.`,
        )
            .mixin(mxnFxAlphaVisibility, false)
            .at(40, 40)
            .show(textObjs);

        textObj1.mxnFxAlphaVisibility.visible = true;

        yield sleep(3000);

        textObj0.mxnFxAlphaVisibility.visible = false;
        textObj1.mxnFxAlphaVisibility.visible = false;
        yield sleep(500);

        yield layers.overlay.solidBelowMessages.fadeOut(500);
        textObjs.destroy();
    });
}

function enrichRoom2(lvl: LvlType.EfficientHome) {
}
