import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { interpv } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnWeightedPedestalMask } from "../mixins/mxn-weighted-pedestal-mask";
import { objFxStarburst54 } from "../objects/effects/obj-fx-startburst-54";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnSimpleSecretValuables() {
    Jukebox.play(Mzk.SharedBaby);
    const lvl = Lvl.SimpleSecretValuables();
    enrichPedestal(lvl);
    enrichNpc(lvl);
    enrichChargingLetters(lvl);
    [lvl.CloudsGroup0, lvl.CloudsGroup1, lvl.CloudsGroup2].forEach(obj => obj.mixin(mxnSinePivot));
    lvl.BehindHubolGroup.children.forEach(obj => obj.mixin(mxnSinePivot));
}

function enrichPedestal(lvl: LvlType.SimpleSecretValuables) {
    lvl.WeightedPedestal.mixin(mxnWeightedPedestalMask, {
        terrainObjs: [lvl.PedestalBlock0, lvl.PedestalBlock1],
        decalObjs: [lvl.PedestalFlopGroup],
        maskWhenWeighted: false,
    });
}

function enrichNpc(lvl: LvlType.SimpleSecretValuables) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        yield* show(
            "Creating things is so important to me.",
            "When I don't get to make something for a while, I get restless.",
            "I find it difficult to relax.",
            "It's hard to find the balance.",
            "I hope that I will find peace when I am older.",
        );
    });
}

function enrichChargingLetters(lvl: LvlType.SimpleSecretValuables) {
    const state = {
        isCharging: false,
        chargeUnit: 0,
    };

    lvl.ChargingGroup.children.forEach(obj =>
        obj
            .mixin(mxnBoilPivot)
            .scaled(0, 0)
            .coro(function* (self) {
                while (true) {
                    yield () => state.isCharging;
                    self.visible = true;
                    yield interpv(self.scale).steps(Rng.intc(2, 4)).to(1, 1).over(Rng.intc(300, 400));
                    yield () => !state.isCharging;
                    yield interpv(self.scale).steps(Rng.intc(2, 4)).to(0, 0).over(Rng.intc(300, 400));
                }
            })
            .invisible()
    );

    lvl.HappyGroup.children.forEach((obj, i) =>
        obj
            .mixin(mxnBoilPivot)
            .step(() => {
                const previousVisible = obj.visible;
                obj.visible = state.chargeUnit >= (i + 1) / lvl.HappyGroup.children.length;
                if (obj.visible !== previousVisible && obj.scale.x > 0) {
                    obj.play(Sfx.Effect.HappyLetterAppear.rate(0.8 + 0.125 * i));
                }
            })
            .invisible()
    );

    lvl.PlayerChargeRegion.step(self => {
        state.isCharging = playerObj.speed.isZero && playerObj.isOnGround && playerObj.collides(self);
        state.chargeUnit = approachLinear(state.chargeUnit, state.isCharging ? 1 : 0, 0.01);
    })
        .coro(function* () {
            yield () => state.chargeUnit >= 1;
            Cutscene.play(function* () {
                yield sleep(1000);
                for (let i = 0; i < lvl.HappyGroup.children.length; i++) {
                    const obj = lvl.HappyGroup.children[i];
                    obj.play(Sfx.Impact.HappyLetterExplode.rate(0.8 + 0.125 * i));
                    objFxStarburst54().at(obj.getWorldCenter()).show();
                    obj.scaled(0, 0);
                    yield sleep(300);
                }
                yield sleep(1000);
                yield* show("Groovy.");
                yield* DramaQuests.complete("SimpleSecretHappy");
            }, { speaker: lvl.IguanaNpc });
        });
}
