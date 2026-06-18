import { Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnFxTintRotate } from "../mixins/effects/mxn-fx-tint-rotate";
import { mxnBoilTextureIndex } from "../mixins/mxn-boil-texture-index";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../mixins/mxn-enemy-death-burst";
import { playerObj } from "../objects/obj-player";
import { objIndexedSprite } from "../objects/utils/obj-indexed-sprite";
import { Rpg } from "../rpg/rpg";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";

export function scnMishaHouse() {
    const quest = Rpg.quest("MishaHouse.DestroyedComputer");
    const lvl = Lvl.MishaHouse();

    lvl.MishaNpc
        .mixin(mxnCutscene, function* () {
            if (quest.everCompleted) {
                yield* show("I'm not aware of any problems in production.");
                return;
            }
            yield* show(
                "I am very sad...",
                "Problems in production...",
            );
        })
        .coro(function* (self) {
            yield () => quest.everCompleted;
            self.head.mouth.emote.happy();
        });

    lvl.Door.objDoor.openTint = 0x000000;

    if (quest.everCompleted) {
        return;
    }

    objMishaComputer()
        .at(lvl.ComputerMarker)
        .zIndexed(ZIndex.Entities)
        .handles("mxnEnemy.died", () =>
            Cutscene.play(function* () {
                yield () => playerObj.isOnGround;

                yield* show(
                    "Well...",
                    "I think that helps.",
                );

                yield* DramaQuests.complete("MishaHouse.DestroyedComputer");
            }, { speaker: lvl.MishaNpc }))
        .show();
}

const [txComputer, ...txsComputerLayers] = Tx.Esoteric.MishaComputer.Layers.split({ count: 3 });

const rankComputer = RpgEnemyRank.create({
    status: {
        health: 20,
        defenses: {
            physical: 80,
        },
    },
});

function objMishaComputer() {
    const computerObj = Sprite.from(txComputer);
    return container(
        computerObj,
        objIndexedSprite(txsComputerLayers)
            .mixin(mxnBoilTextureIndex)
            .mixin(mxnFxTintRotate),
    )
        .pivoted(29, 30)
        .mixin(mxnEnemy, { hurtboxes: [computerObj], rank: rankComputer })
        .mixin(mxnEnemyDeathBurst, { map: [0x808080, 0x505050, 0xa0a0a0] });
}
