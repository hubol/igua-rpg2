import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataKeyItem } from "../data/data-key-item";
import { DramaInventory } from "../drama/drama-inventory";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnBallonable } from "../mixins/mxn-ballonable";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSign } from "../mixins/mxn-sign";
import { objCollectiblePocketItemSpawner } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { objValuableSpawner } from "../objects/obj-valuable-spawner";
import { objTransitionedSprite } from "../objects/utils/obj-transitioned-sprite";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgPocket } from "../rpg/rpg-pocket";
import { RpgStatus } from "../rpg/rpg-status";

export function scnNewBalltownOutskirts() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.NewBalltownOutskirts();

    enrichMiner(lvl);
    enrichFarmer(lvl);
    enrichSecretShopExterior(lvl);
}

function enrichFarmer(lvl: LvlType.NewBalltownOutskirts) {
    const startingPosition = lvl.FarmerNpc.vcpy();

    objTransitionedSprite({
        anchorProvider: () => [0.5, 1],
        txProvider: () => Rpg.flags.outskirts.farmer.hasBagOfSeeds ? Tx.Esoteric.Decoration.SeedBag : null,
    })
        .at(lvl.FarmerBagOfSeeds)
        .zIndexed(ZIndex.TerrainDecals)
        .show();

    lvl.FarmerNpc.mixin(mxnCutscene, function* () {
        scene.camera.mode = "controlled";

        if (!Rpg.flags.outskirts.farmer.hasBagOfSeeds) {
            yield* show(
                "I need to jump-start my farming career.",
                `But I need a ${DataKeyItem.Manifest.BagOfSeeds.name}...`,
            );

            const offer = yield* DramaInventory.askWhichToOffer([{ kind: "key_item", id: "BagOfSeeds" }]);

            if (offer) {
                yield* show(
                    "Yo!! What?!",
                    "Thank you!!! This will let me plant ballfruit.",
                    "Just talk to me when you want ballfruit planted.",
                );
                Rpg.flags.outskirts.farmer.hasBagOfSeeds = true;
            }
            else {
                yield* show("...");
            }

            return;
        }

        yield* show("I should replant the ballfruit? Sure.");

        const choice = yield* ask("What ballfruit do you want? Choose wisely.", "Type A", "Type B");
        const choicePocketItem: RpgPocket.Item = choice === 0 ? "BallFruitTypeA" : "BallFruitTypeB";

        yield* show((choice === 0 ? "Type A" : "Type B") + ", got it.");

        yield interpvr(scene.camera).to(lvl.FarmingRegion).over(1000);

        lvl.FarmerNpc.at(lvl.FarmerAppearMarker);
        yield* lvl.FarmerNpc.walkTo(lvl.FarmerMoveToMarker.x);

        for (const spawnerObj of Instances(objCollectiblePocketItemSpawner)) {
            const maybeObj = spawnerObj.spawn(choicePocketItem);
            if (maybeObj) {
                maybeObj.mixin(mxnNudgeAppear);
                yield sleepf(5);
            }
        }

        yield sleep(1500);

        // TODO farmer flashes for 1 frame. I think cutscene runner needs to be lowest priority!
        scene.camera.mode = "follow_player";
        lvl.FarmerNpc.at(startingPosition);
        lvl.FarmerNpc.auto.setFacingImmediately(1);
    });
}

const atkPickaxe = RpgAttack.create({
    physical: 25,
});

const ranks = {
    miner: RpgEnemyRank.create({
        status: {
            faction: RpgFaction.Miner,
        },
    }),
};

function enrichMiner(lvl: LvlType.NewBalltownOutskirts) {
    function hasHighMiningSpeed() {
        return Rpg.flags.outskirts.miner.pickaxeHealth > 0
            && Rpg.flags.outskirts.miner.hasUpgradedPickaxe;
    }

    function getMiningDelayRate() {
        return hasHighMiningSpeed() ? 0.2 : 1;
    }

    const valuableSpawnerObj = objValuableSpawner([lvl.MinerValuable0, lvl.MinerValuable1, lvl.MinerValuable2]);

    const pickaxeAttackObj = lvl.PickaxeHitbox.mixin(mxnRpgAttack, {
        attack: atkPickaxe,
        attacker: ranks.miner.status,
    });
    pickaxeAttackObj.isAttackActive = false;

    lvl.MinerPicaxeBrokenBandages.mixin(mxnBoilPivot).invisible();
    lvl.MinerPicaxeBurst.invisible();
    const minerPicaxeObj = lvl.MinerPicaxe
        .merge({ isAtRest: false })
        .step(self => self.tint = hasHighMiningSpeed() ? 0x00ff00 : 0xffffff)
        .coro(function* (self) {
            const initialAngle = self.angle;

            while (true) {
                const isGoingFast = hasHighMiningSpeed();

                yield interp(self, "angle").steps(4).to(135).over(1000 * getMiningDelayRate());
                self.isAtRest = true;
                lvl.MinerPicaxeBrokenBandages.visible = Rpg.flags.outskirts.miner.pickaxeHealth <= 0;
                yield () =>
                    !valuableSpawnerObj.isFull && Rpg.flags.outskirts.miner.pickaxeHealth > 0
                    && !Cutscene.isPlaying;
                self.isAtRest = false;
                yield sleep(250 * getMiningDelayRate());
                yield interp(self, "angle").steps(4).to(initialAngle).over(300 * getMiningDelayRate());
                Rpg.flags.outskirts.miner.pickaxeHealth--;
                pickaxeAttackObj.isAttackActive = true;
                self.play(Sfx.Impact.PickaxeRock.rate(0.9, 1.1));
                lvl.MinerPicaxeBurst.visible = true;
                yield sleep(125 * getMiningDelayRate());
                pickaxeAttackObj.isAttackActive = false;
                valuableSpawnerObj.spawn(isGoingFast && Rng.float() > 0.67 ? "blue" : "orange");
                yield sleep(125 * getMiningDelayRate());
                lvl.MinerPicaxeBurst.visible = false;
                yield sleep(250 * getMiningDelayRate());
            }
        });

    lvl.MinerNpc.mixin(mxnCutscene, function* () {
        yield () => minerPicaxeObj.isAtRest;
        yield* show(
            "I'm a miner. I extract valuables from these boulders.",
            "My picaxe is very precious to me.",
        );

        if (Rpg.flags.outskirts.miner.pickaxeHealth <= 0) {
            yield* show("It broke after too much use. I heard there are picaxes for sale in the Balltown.");
            Rpg.flags.outskirts.miner.toldPlayerAboutDepletedPickaxeHealth = true;
        }
        else {
            const picaxeHealth = Rpg.flags.outskirts.miner.pickaxeHealth;
            // TODO pluralization utility?
            yield* show(
                `It currently has ${picaxeHealth} hit ${picaxeHealth === 1 ? "point" : "points"} remaining.`,
            );
        }

        if (Rpg.inventory.keyItems.has("UpgradedPickaxe", 1)) {
            yield* show(`Oh! I see that you have the ${DataKeyItem.Manifest.UpgradedPickaxe.name}!`);
            if (yield* ask("Will you give it to me? You can have any valuables I mine")) {
                yield* DramaInventory.removeCount({ kind: "key_item", id: "UpgradedPickaxe" }, 1);
                yield* show("...?!", "Thank you so much!", "I will get right to work.");
                Rpg.flags.outskirts.miner.hasUpgradedPickaxe = true;
                Rpg.flags.outskirts.miner.pickaxeHealth += 15;
            }
            else {
                yield* show("Please let me know if you change your mind. That picaxe looks baller.");
            }
        }
    });
}

function enrichSecretShopExterior(lvl: LvlType.NewBalltownOutskirts) {
    const ballons = [69_100_000, 420_000_000].map((seed): RpgStatus.Ballon => ({ health: 1, healthMax: 1, seed }));
    lvl.MarketingBallonsMarker.zIndexed(ZIndex.TerrainDecals).mixin(mxnBallonable, {
        attachPoint: lvl.MarketingBallonsMarker,
        ballons,
    });
    lvl.SecretShopSign.mixin(mxnSign, "The Secret Shop\n\nShhh! It's a secret!");
}
