import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { container } from "../../lib/pixi/container";
import { DramaGifts } from "../drama/drama-gifts";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIndianaDarkEvilHole() {
    const lvl = Lvl.IndianaDarkEvilHole();
    enrichShoeHaverNpc(lvl);
    enrichEnemies(lvl);
}

function enrichShoeHaverNpc(lvl: LvlType.IndianaDarkEvilHole) {
    lvl.ShoeHaverNpc
        .mixin(mxnCutscene, function* () {
            const gift = Rpg.gift("Indiana.DarkEvilHole.Illuminate");
            if (gift.isGiveable()) {
                yield* DramaGifts.give(gift);
            }
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
