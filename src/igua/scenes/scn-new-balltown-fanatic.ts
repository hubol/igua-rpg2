import { BLEND_MODES } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { interpv } from "../../lib/game-engine/routines/interp";
import { Jukebox } from "../core/igua-audio";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { mxnBoilMirrorRotate } from "../mixins/mxn-boil-mirror-rotate";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnNewBalltownFanatic() {
    Jukebox.play(Mzk.CedarWorld);
    const lvl = Lvl.NewBalltownFanatic();
    lvl.FurnitureChandelier.mixin(mxnBoilPivot);
    lvl.ChandelierLights.children.forEach(x => x.mixin(mxnBoilMirrorRotate).blendMode = BLEND_MODES.ADD);
    enrichBallFruitFanaticNpc(lvl);
    enrichSecretSymbols(lvl);
}

function enrichSecretSymbols(lvl: LvlType.NewBalltownFanatic) {
    const { ballFruitFanatic } = Rpg.flags.newBalltown;

    lvl.SecretSymbols.children.forEach((obj, i) => {
        if (ballFruitFanatic.succesfulDeliveriesCount > i) {
            return;
        }
        obj.invisible().coro(function* () {
            yield () => ballFruitFanatic.succesfulDeliveriesCount > i;
            obj.visible = true;
            obj.scale.set(0, 0);
            yield interpv(obj.scale).steps(4).to(1, 1).over(300);
        });
    });
}

function enrichBallFruitFanaticNpc(lvl: LvlType.NewBalltownFanatic) {
    lvl.BallFruitFanaticNpc.mixin(mxnCutscene, function* () {
        const typePreference = Rpg.flags.newBalltown.ballFruitFanatic.typePreference;

        const hasBallFruitTypeA = Rpg.inventory.pocket.has(
            "BallFruitTypeA",
            10,
        );
        const hasBallFruitTypeB = Rpg.inventory.pocket.has(
            "BallFruitTypeB",
            10,
        );

        if (typePreference === null) {
            yield* show(
                "Welcome in. I'm the ballfruit fanatic.",
                "I moved to New Balltown after eating one of the ballfruit that fell and bounced all the way to the world below.",
                "Please bring me 10 ballfruit.",
            );
        }

        if (hasBallFruitTypeA && hasBallFruitTypeB) {
            // TODO something special!!
            // Assuming multiple slots are supported!
            return;
        }
        else if (hasBallFruitTypeA || hasBallFruitTypeB) {
            yield* show("Wow!! You got 10 ballfruit!");
            if (
                (hasBallFruitTypeA && typePreference === "BallFruitTypeA")
                || (hasBallFruitTypeB && typePreference === "BallFruitTypeB")
            ) {
                const rewardName = DramaQuests.peekRewardName("NewBalltown.Fanatic.FruitDelivery");
                yield* show(
                    "These look awesome.",
                    `How much do I owe you? Does ${rewardName} sound good?`,
                );
                yield* DramaInventory.removeCount({ kind: "pocket_item", id: typePreference }, 10);
                yield* DramaQuests.receiveReward("NewBalltown.Fanatic.FruitDelivery");
                Rpg.flags.newBalltown.ballFruitFanatic.succesfulDeliveriesCount++;
                return;
            }

            yield* show("Wait a minute...");

            if (hasBallFruitTypeA && typePreference !== "BallFruitTypeA") {
                yield* show(
                    "THESE ARE SEEDLESS!!!!",
                    "What the hell is going on?",
                    "I prefer the texture of the seeds.",
                    "Please bring 10 ballfruit with seeds.",
                );
                Rpg.flags.newBalltown.ballFruitFanatic.typePreference = "BallFruitTypeB";
            }
            else if (hasBallFruitTypeB && typePreference !== "BallFruitTypeB") {
                yield* show(
                    "THESE HAVE SEEDS!!!!",
                    "Um... hello?!?!",
                    "I am terribly allergic to the seeds.",
                    "Please bring 10 seedless ballfruit.",
                );
                Rpg.flags.newBalltown.ballFruitFanatic.typePreference = "BallFruitTypeA";
            }
        }
    });
}
