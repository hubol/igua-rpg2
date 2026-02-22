import { Graphics } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { SoundInstance } from "../../lib/game-engine/audio/sound";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataPocketItem } from "../data/data-pocket-item";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnIguanaSpeaker } from "../mixins/mxn-iguana-speaker";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Rpg } from "../rpg/rpg";

// TODO I would like this to work differently
// Perhaps flags expose their own API
const consts = {
    maxVaseMoistureUnits: 1000,
};

export function scnVaseInhabitant() {
    Jukebox.play(Mzk.FatFire);

    const vaseProgress = {
        get fillUnit() {
            return Math.max(0, Math.min(1, Rpg.flags.vase.moistureUnits / consts.maxVaseMoistureUnits));
        },
        get isFilled() {
            return this.fillUnit >= 1;
        },
    };

    const lvl = Lvl.VaseInhabitant();

    const vaseMaskObj = new Graphics()
        .beginFill(0xffffff)
        .drawRect(0, -lvl.VaseWater.height, lvl.VaseWater.width, lvl.VaseWater.height)
        .scaled(1, 0)
        .coro(function* (self) {
            self.scale.y = vaseProgress.fillUnit;

            while (true) {
                yield onPrimitiveMutate(() => vaseProgress.fillUnit);
                yield interp(self.scale, "y").to(vaseProgress.fillUnit).over(1000);
            }
        })
        .at(lvl.VaseWater)
        .add(0, lvl.VaseWater.height)
        .show();

    lvl.VaseWater
        .masked(vaseMaskObj);

    lvl.FillVaseRegion
        .mixin(mxnSpeaker, { name: "Giant Vase", colorPrimary: 0x0000a0, colorSecondary: 0x0080f0 })
        .mixin(mxnCutscene, function* () {
            if (yield* ask("A giant vase... Add moisture?")) {
                if (Rpg.character.status.conditions.wetness.value <= 0) {
                    yield* show("No moisture to add.");
                }
                else {
                    yield* show(`Added ${Rpg.character.status.conditions.wetness.value} units.`);
                    Rpg.flags.vase.moistureUnits += Rpg.character.status.conditions.wetness.value;
                    Rpg.character.status.conditions.wetness.value = 0;
                }
            }
        })
        .step(self => self.interact.enabled = !vaseProgress.isFilled);

    const floatingIguanaObj = objIguanaPuppet(lvl.VaseNpc.objIguanaNpc.persona.looks)
        .mixin(mxnIguanaSpeaker, lvl.VaseNpc.objIguanaNpc.persona)
        .coro(function* (self) {
            const y = self.y;

            self
                .step(() => {
                    self.y = y - (vaseMaskObj.height > 15 ? (vaseMaskObj.height - 15) : 0);
                    if (self.y !== y) {
                        self.pedometer += 0.035;
                    }
                })
                .coro(function* () {
                    yield () => self.y !== y;
                    self.gait = 1;
                    self.mixin(mxnSinePivot);
                });
        })
        .mixin(mxnCutscene, function* () {
            yield* show("I'm trapped. Please help.");
        })
        .step(self => {
            self.interact.enabled = !self.collides(lvl.FillVaseRegion);
        })
        .at(lvl.VaseNpcMarker)
        .zIndexed(ZIndex.CharacterEntities)
        .show();

    floatingIguanaObj.facing = -1;

    const iguanaObjs = {
        floatingObj: floatingIguanaObj,
        surfacedObj: lvl.VaseNpc,
    };

    if (vaseProgress.isFilled) {
        iguanaObjs.floatingObj.destroy();
    }
    else {
        iguanaObjs.surfacedObj.visible = false;
        iguanaObjs.floatingObj
            .coro(function* (self) {
                yield () => vaseProgress.isFilled;
                Cutscene.play(function* () {
                    yield interpvr(self).to(iguanaObjs.surfacedObj).over(400);
                    self.destroy();
                    iguanaObjs.surfacedObj.visible = true;
                });
            });
    }

    iguanaObjs.surfacedObj
        .coro(function* (self) {
            yield () => self.visible;
            if (!Rpg.quest("VaseInhabitant.Saved").everCompleted) {
                Cutscene.play(function* () {
                    yield* DramaQuests.complete("VaseInhabitant.Saved");
                    yield* show(
                        "Thank you so much for rescuing me!",
                        "If you want more shoes like that, I can create some from Cactus Fruit.",
                    );
                }, { speaker: self });
            }

            self
                .mixin(mxnCutscene, function* () {
                    const routes = [
                        { vaseStoredKey: "cactusFruitTypeA", pocketItemId: "CactusFruitTypeA" },
                        { vaseStoredKey: "cactusFruitTypeB", pocketItemId: "CactusFruitTypeB" },
                    ] as const;

                    const result = yield* ask(
                        "I need 5 of each type of Cactus Fruit to make a shoe. I'll store them when you give me 5.",
                        ...routes
                            .map(({ pocketItemId }) =>
                                Rpg.inventory.pocket.has(pocketItemId, 5)
                                    ? "Give\n" + DataPocketItem.getById(pocketItemId).name
                                    : null
                            ),
                        "I see.",
                    );

                    for (let i = 0; i < routes.length; i++) {
                        if (result !== i) {
                            continue;
                        }

                        const { pocketItemId, vaseStoredKey } = routes[i];

                        if (Rpg.flags.vase[vaseStoredKey] >= 5) {
                            yield* show("I already have five.");
                            return;
                        }

                        yield* DramaInventory.removeCount({ kind: "pocket_item", id: pocketItemId }, 5);
                        Rpg.flags.vase[vaseStoredKey] += 5;

                        while (Rpg.flags.vase.cactusFruitTypeA >= 5 && Rpg.flags.vase.cactusFruitTypeB >= 5) {
                            yield* show("Nice. You've given me enough for a shoe!");
                            yield* DramaQuests.complete("VaseInhabitant.CombinedCactusFruits");
                            Rpg.flags.vase.cactusFruitTypeA -= 5;
                            Rpg.flags.vase.cactusFruitTypeB -= 5;
                        }
                    }
                });
        });

    objVaseVocalPlayback().show();
}

function objVaseVocalPlayback() {
    const vocalCueSeconds = [
        17.307,
        54.230,
    ];

    let soundInstance = Null<SoundInstance>();

    function getPlayheadSeconds() {
        return Jukebox.getEstimatedPlayheadPosition(Mzk.FatFire);
    }

    return container()
        .coro(function* () {
            while (true) {
                for (const seconds of vocalCueSeconds) {
                    yield () => getPlayheadSeconds() >= seconds - 0.1;
                    const delta = getPlayheadSeconds() - seconds;
                    if (delta > 0.02) {
                        continue;
                    }

                    const when = Math.max(0, -delta);
                    const sfx = Rng.choose(Sfx.Character.Vase.StuckInAVase, Sfx.Character.Vase.OutOfTheVase);
                    soundInstance = sfx.playInstance(when);
                }

                yield () => getPlayheadSeconds() < 1;
            }
        })
        .step(() => {
            if (!soundInstance) {
                return;
            }

            soundInstance.rate = Jukebox.rate;
        })
        .on("removed", () => soundInstance?.stop());
}
