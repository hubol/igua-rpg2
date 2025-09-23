import { Graphics } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { DramaInventory } from "../drama/drama-inventory";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { CtxPocketItems, objCollectiblePocketItemSpawner } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";

export function scnColosseumMiffed() {
    CtxPocketItems.value.pocketItemIds.typeA = "EmoBallistaBolt";
    CtxPocketItems.value.pocketItemIds.typeB = "BallFruitTypeA";
    CtxPocketItems.value.variant = "objFloating";
    const lvl = Lvl.ColosseumMiffed();
    enrichEmoBallista(lvl);
}

function enrichEmoBallista(lvl: LvlType.ColosseumMiffed) {
    let bolts = 0;

    lvl.EmoBallistaPlaceholder.mixin(mxnSpeaker, {
        name: "Emo Ballista",
        colorPrimary: 0x808080,
        colorSecondary: 0x404040,
    })
        .mixin(mxnCutscene, function* () {
            const count = Rpg.inventory.pocket.count("EmoBallistaBolt");
            if (count > 0) {
                yield* DramaInventory.removeCount({ kind: "pocket_item", id: "EmoBallistaBolt" }, count);
                bolts += count;
                for (const spawnerObj of Instances(objCollectiblePocketItemSpawner)) {
                    spawnerObj.spawn();
                }
            }
            if (bolts === 0) {
                yield* show("No bolts. Look west.");
                return;
            }

            if (yield* ask(`${bolts} bolt(s). Fire?`)) {
                objGiantBallistaAttack().at(lvl.EmoBallistaPlaceholder).show();
                bolts--;
            }
        });
}

function objGiantBallistaAttack() {
    return new Graphics()
        .beginFill(0xff0000)
        .drawCircle(0, 0, 48)
        .mixin(mxnRpgAttack, { attack: atkGiantBallista })
        .step(self => self.x -= 1)
        .handles("mxnRpgAttack.hit", self => self.destroy());
}

const atkGiantBallista = RpgAttack.create({
    emotional: 5,
    versus: RpgFaction.Enemy,
});
