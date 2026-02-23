import { Container, Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Sound, SoundInstance } from "../../lib/game-engine/audio/sound";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { ValuesOf } from "../../lib/types/values-of";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataCuesheet } from "../data/data-cuesheet";
import { DataPocketItem } from "../data/data-pocket-item";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilSeed } from "../mixins/mxn-boil-seed";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnIguanaSpeaker } from "../mixins/mxn-iguana-speaker";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { mxnSpeakingMouth } from "../mixins/mxn-speaking-mouth";
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

    objVaseVocalPlayback([iguanaObjs.floatingObj, iguanaObjs.surfacedObj]).show();
}

function objVaseVocalPlayback(speakerObjs: Array<Container>) {
    const vocalCueSeconds = [
        17.307,
        54.230,
    ];

    const cuesheets = new Map<Sound, ValuesOf<typeof DataCuesheet["Vase"]>>();
    cuesheets.set(Sfx.Character.Vase.OutOfTheVase, DataCuesheet.Vase.OutOf);

    let soundInstance = Null<SoundInstance>();
    let isSinging = false;
    let isSilenced = false;

    function getPlayheadSeconds() {
        return Jukebox.getEstimatedPlayheadPosition(Mzk.FatFire);
    }

    function getSpeakerObj() {
        for (const speakerObj of speakerObjs) {
            if (!speakerObj.destroyed && speakerObj.visible) {
                return speakerObj;
            }
        }

        return speakerObjs.last;
    }

    function isSpeakerInCutscene(): boolean {
        return Cutscene.isPlaying && speakerObjs.includes(Cutscene.current?.attributes?.speaker as any);
    }

    const lyricTextObj = objText
        .MediumIrregular("", { tint: 0x478D26 })
        .anchored(0.5, 1)
        .mixin(mxnBoilSeed);

    return container(
        lyricTextObj,
    )
        .coro(function* () {
            while (true) {
                for (const seconds of vocalCueSeconds) {
                    yield () => getPlayheadSeconds() >= seconds - 0.1;
                    const delta = getPlayheadSeconds() - seconds;
                    if (delta > 0.02) {
                        continue;
                    }

                    const when = Math.max(0, -delta);
                    const sfx = Sfx.Character.Vase.OutOfTheVase;
                    // const sfx = Rng.choose(Sfx.Character.Vase.StuckInAVase, Sfx.Character.Vase.OutOfTheVase);
                    soundInstance = sfx.playInstance(when);
                    for (const [start, end, _, data] of cuesheets.get(sfx) ?? []) {
                        yield () => soundInstance!.estimatedPlayheadPosition >= start;
                        const speakerObj = getSpeakerObj();
                        lyricTextObj.at(speakerObj.getWorldCenter()).add(0, -40);
                        lyricTextObj.text = data;
                        if (!isSilenced || !isSpeakerInCutscene()) {
                            isSinging = true;
                            isSilenced = false;
                        }

                        yield () => soundInstance!.estimatedPlayheadPosition >= end;
                        lyricTextObj.text = "";
                        isSinging = false;
                    }
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
        .step(() => {
            if (!isSilenced && isSpeakerInCutscene()) {
                isSilenced = true;
                isSinging = false;
            }

            lyricTextObj.visible = isSinging;
            if (soundInstance) {
                soundInstance.gain = approachLinear(soundInstance.gain, isSilenced ? 0 : 0.7, 0.1);
            }
        })
        .coro(function* () {
            while (true) {
                yield () => isSinging;
                const mouthObj = getSpeakerObj().findIs(mxnSpeakingMouth).last;
                yield interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(1).over(Rng.intc(1, 2) * 144);
                yield sleepf(2);
                yield interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(0).over(144);
            }
        })
        .on("removed", () => soundInstance?.stop())
        .zIndexed(ZIndex.CharacterEntities);
}
