import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIndianaDarkEvilHole() {
    Jukebox.play(Mzk.UndergroundRucksack);
    const lvl = Lvl.IndianaDarkEvilHole();
    enrichLostNpc(lvl);
    enrichEnemies(lvl);
}

function enrichLostNpc(lvl: LvlType.IndianaDarkEvilHole) {
    const quest = Rpg.quest("DarkEvilHole.Rescue");
    let completedQuest = false;

    lvl.LostNpc
        .mixin(mxnCutscene, function* () {
            if (!completedQuest) {
                yield* show(
                    "Thanks for your help!",
                );

                yield* DramaQuests.complete(quest);
                completedQuest = true;
            }

            yield* dramaShop("IndianaRescued", lvl.LostNpc.speaker);
        });
}

function enrichEnemies(lvl: LvlType.IndianaDarkEvilHole) {
    const spikeObjs = [...lvl.MiffedAttacksDestroyRegion.collidesAll(Instances(mxnRpgAttack))];

    const speakerObj = container()
        .mixin(mxnSpeaker, { name: "Spirit of Dark Evil Hole", tintPrimary: 0x202020, tintSecondary: 0x404040 });

    lvl.AngelMiffed
        .handles("mxnEnemy.died", () => {
            Cutscene.play(function* () {
                spikeObjs.forEach(obj => obj.destroy());
                yield () => playerObj.isOnGround;
                yield* show("You hear the sound of several spikes disappearing from the world.");
            }, { speaker: speakerObj });
        });

    lvl.AngelSuggestive
        .handles("mxnEnemy.died", () => {
            Cutscene.play(function* () {
                lvl.SuggestiveAngelBlock.destroy();
                yield () => playerObj.isOnGround;
                yield* show("You hear the sound of a large block disappearing from the world.");
            }, { speaker: speakerObj });
        });
}
