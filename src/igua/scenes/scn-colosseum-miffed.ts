import { Graphics } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { Jukebox } from "../core/igua-audio";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaWallet } from "../drama/drama-wallet";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { CtxPocketItems, objCollectiblePocketItemSpawner } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";

export function scnColosseumMiffed() {
    Jukebox.play(Mzk.Roundabout);
    CtxPocketItems.value.pocketItemIds.typeA = "EmoBallistaBolt";
    CtxPocketItems.value.pocketItemIds.typeB = "BallFruitTypeA";
    CtxPocketItems.value.variant = "objFloating";
    const lvl = Lvl.ColosseumMiffed();
    enrichEmoBallista(lvl);
    enrichWatcherNpc(lvl);
}

function enrichWatcherNpc(lvl: LvlType.ColosseumMiffed) {
    let spoken = false;
    let miffAttacked = false;

    lvl.EnemyMiffed.handles("damaged", (_, event) => {
        if (!event.rejected && !event.ambient) {
            miffAttacked = true;
        }
    });

    lvl.ColosseumWatcherNpc.mixin(mxnCutscene, function* () {
        const miffDefeated = lvl.EnemyMiffed.destroyed;

        if (miffDefeated && spoken) {
            yield* show("You won!!");
            return;
        }
        if (!miffDefeated && miffAttacked) {
            yield* show(
                "I saw you fighting!",
                "I'm guessing it's not going anywhere, though, if you're talking to me.",
                "My #1 bitch in Strange Market has fought a sprite like this before. Maybe he could help you.",
            );
            Rpg.flags.colosseum.watcher.toldPlayerAboutStrangeMarketFightingTechnique = true;
            spoken = true;
            return;
        }

        const result = yield* ask(
            "What brings you to the dark colosseum? Are you here to defeat the sprite?",
            "Yes",
            "No",
            miffDefeated ? "I already did" : null,
        );

        if (result === 0) {
            yield* show("Well, best of luck to you!");
        }
        else if (result === 1) {
            yield* show("Ok. WORD TO THE WISE: There is not much else to do here.");
        }
        else {
            yield* show("Oh!", "Good job.");
            yield* DramaWallet.rewardValuables(1);
            yield* show("A prize for you!!");
        }

        spoken = true;
    });
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
