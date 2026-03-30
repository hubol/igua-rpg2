import { BLEND_MODES, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { isOnScreen } from "../../lib/game-engine/logic/is-on-screen";
import { factor, interpr, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaFacts } from "../drama/drama-facts";
import { DramaGifts } from "../drama/drama-gifts";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaPotions } from "../drama/drama-potions";
import { DramaQuests } from "../drama/drama-quests";
import { dramaQuizComputerScience } from "../drama/drama-quiz-computer-science";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { Cutscene, DevKey, layers, scene } from "../globals";
import { mxnFxAlphaVisibility } from "../mixins/effects/mxn-fx-alpha-visibility";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSign } from "../mixins/mxn-sign";
import { mxnSoundLoop } from "../mixins/mxn-sound-loop";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objCharacterGamblingExpert } from "../objects/characters/obj-character-gambling-expert";
import { objCharacterWindTurbine } from "../objects/characters/obj-character-wind-turbine";
import { mxnEsotericArtInteractive, objEsotericArt } from "../objects/esoteric/obj-esoteric-art";
import { objEsotericRemovedShoes } from "../objects/esoteric/obj-esoteric-removed-shoes";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { objFish } from "../objects/obj-fish";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgStatus } from "../rpg/rpg-status";
import { TerrainAttributes } from "../systems/terrain-attributes";

export function scnEfficientHome() {
    Jukebox.play(Mzk.UnforgivableToner);
    scene.camera.defaultMode = "controlled";
    const lvl = Lvl.EfficientHome();
    scene.camera.at(Math.floor(playerObj.x / 512) * 512, Math.floor(playerObj.y / 288) * 288);

    enrichHelium(lvl);
    enrichRoom0(lvl);
    enrichRoom1(lvl);
    enrichRoom2(lvl);
    enrichRoom3(lvl);
    enrichRoom4(lvl);
    enrichRoom5(lvl);
    enrichRoom6(lvl);
    enrichRoom7(lvl);
}

function enrichHelium(lvl: LvlType.EfficientHome) {
    [lvl.HeliumMarker1, lvl.HeliumMarker2].forEach((obj, index) =>
        objHeliumExhaust()
            .step(
                self =>
                    self.isAttackActive = Rpg.quest("GreatTower.EfficientHome.Ringer.ReceivedFish").everCompleted
                        && Rpg.character.status.conditions.helium.ballons.length === index + 1,
                -1,
            )
            .at(obj)
            .show()
    );
}

function enrichRoom0(lvl: LvlType.EfficientHome) {
    const artObj = container()
        .coro(function* (self) {
            while (true) {
                const seed = Rpg.flags.greatTower.efficientHome.artSeed;

                self.removeAllChildren();
                if (seed !== null) {
                    objEsotericArt(seed)
                        .mixin(mxnEsotericArtInteractive)
                        .show(self);
                }
                // TODO types could be improved maybe?
                yield onPrimitiveMutate(() => Rpg.flags.greatTower.efficientHome.artSeed ?? -1);
            }
        })
        .at(lvl.ArtRegion)
        .zIndexed(ZIndex.BackgroundDecals)
        .show();

    lvl.CloudHouseNpc0.mixin(mxnCutscene, function* () {
        yield* ask("You can't tell, but right now I'm working on my art.", "You are?");
        yield* show("Yep, I'm dreaming up big ideas...");
        yield sleep(1000);
        yield* show("Oh! Here's an idea now.");
        yield interpvr(artObj.pivot).factor(factor.sine).translate(0, -280).over(artObj.children.length ? 1000 : 0);
        Rpg.flags.greatTower.efficientHome.artSeed = Rng.intc(0, Math.floor(Number.MAX_SAFE_INTEGER / 2));
        yield interpvr(artObj.pivot).factor(factor.sine).to(0, 0).over(500);
        Sfx.Cutscene.ArtCreate.rate(0.9, 1.1).play();
    });
}

function enrichRoom1(lvl: LvlType.EfficientHome) {
    lvl.CloudHouseAddictNpc.mixin(mxnCutscene, function* () {
        yield* show("I love foam insulation!");
        layers.overlay.solidBelowMessages.blendMode = BLEND_MODES.SUBTRACT;
        yield sleep(400);
        yield layers.overlay.solidBelowMessages.fadeIn(500);
        Jukebox.applyGainRamp(Mzk.UnforgivableToner, 0, 1000);
        yield sleep(1000);

        const addictionSfx = Sfx.Character.MarinsAddiction.playInstance();

        const textObjs = container().at(40, 40).show(layers.overlay.messages);

        const textObj0 = objText.Medium(
            `${lvl.CloudHouseAddictNpc.speaker.name} is addicted to eating foam insulation.`,
        )
            .mixin(mxnFxAlphaVisibility, false)
            .show(textObjs);

        textObj0.mxnFxAlphaVisibility.visible = true;

        yield () => addictionSfx.estimatedPlayheadPosition >= 3.18;

        const textObj1 = objText.Medium(
            `Last year, ${lvl.CloudHouseAddictNpc.speaker.name} ate 150,000 gallon-pounts of foam insulation.`,
        )
            .mixin(mxnFxAlphaVisibility, false)
            .at(40, 40)
            .show(textObjs);

        textObj1.mxnFxAlphaVisibility.visible = true;

        yield sleep(3000);

        textObj0.mxnFxAlphaVisibility.visible = false;
        textObj1.mxnFxAlphaVisibility.visible = false;
        Jukebox.applyGainRamp(Mzk.UnforgivableToner, 1, 1000);
        yield sleep(500);

        yield layers.overlay.solidBelowMessages.fadeOut(500);
        textObjs.destroy();
    });
}

function enrichRoom2(lvl: LvlType.EfficientHome) {
    const receivedFishQuest = Rpg.quest("GreatTower.EfficientHome.Ringer.ReceivedFish");
    const ballons = [{ health: 100, healthMax: 100, seed: 0xc01e }];

    let exhaustPrerequisitesMet = receivedFishQuest.everCompleted;

    objHeliumExhaust()
        .step(
            self =>
                self.isAttackActive =
                    (Rpg.character.status.conditions.helium.ballons.length === 0 || ballons.length === 0)
                    && exhaustPrerequisitesMet,
            -1,
        )
        .at(lvl.HeliumMarker0)
        .show();

    [lvl.FishCeilingBlock, lvl.FishWallBlock].forEach(obj => obj.attributes = TerrainAttributes.Decorative);

    objFish.forRinger()
        .at(lvl.FishMarker)
        .zIndexed(ZIndex.FrontDecals)
        .step(self => self.visible = receivedFishQuest.everCompleted)
        .show();

    lvl.CloudHouseRingerNpc
        .handles("mxnSpeaker.speakingStarted", self => self.speed.y = -2)
        .mixin(mxnCutscene, function* () {
            if (!lvl.CloudHouseRingerNpc.speaker.spokeOnceInCurrentScene) {
                yield* show(`DING! It's me, ${lvl.CloudHouseRingerNpc.speaker.name}!`);
            }

            while (true) {
                const playerHasFish = Rpg.inventory.count({ kind: "key_item", id: "RingerFish" }) >= 1;

                const result = yield* ask(
                    "What do you need? DING?",
                    (playerHasFish || receivedFishQuest.everCompleted)
                        ? null
                        : "An errand!",
                    playerHasFish ? "Your fish is here!" : null,
                    receivedFishQuest.everCompleted ? "Secret helium help" : null,
                    "Tell me about yourself",
                    "Nothing",
                );

                if (result === 0) {
                    yield* show("I would love a fish.", "It would really enhance the natural dwelling vibe. DING!");
                    Rpg.flags.greatTower.efficientHome.ringer.toldPlayerAboutDesireForFish = true;
                }
                else if (result === 1) {
                    yield* DramaInventory.removeCount({ kind: "key_item", id: "RingerFish" }, 1);
                    yield* DramaQuests.complete("GreatTower.EfficientHome.Ringer.ReceivedFish");
                    yield* show("Wow! Fantastic!", "What a fish! A damn good fish, indeed!", "DING! DING! DING! DING!");
                    yield sleep(333);
                    yield* show("I will now give you access to a local helium secret.");
                    yield* lvl.CloudHouseRingerNpc.walkTo(lvl.HeliumMarker0.x);
                    lvl.CloudHouseRingerNpc.auto.facing = 1;

                    yield* show("DING! If you visit my apartment without any ballons...");

                    yield interpr(ballons[0], "health").factor(factor.sine).to(0).over(1000);
                    lvl.CloudHouseRingerNpc.mxnBallonable.rpgStatusEffects.ballonHealthDepleted(ballons[0]);
                    ballons.length = 0;
                    exhaustPrerequisitesMet = true;

                    yield sleep(500);
                    yield* show("...Then a helium vein will appear.");

                    yield sleep(500);
                    ballons.push(RpgStatus.createBallon());
                    lvl.CloudHouseRingerNpc.mxnBallonable.rpgStatusEffects.ballonCreated(ballons[0]);
                    yield sleep(500);

                    yield* show("Once you have one ballon, then the vein will disappear.");

                    yield* show(
                        "You can find similar mysteries in apartments 5 and 6.",
                        "Use the dip switches.",
                        "I believe in you. DING!!!",
                    );
                    break;
                }
                else if (result === 2) {
                    yield* show(
                        "My apartment, apartment 2, will reveal a helium spot when you have no ballons. DING!",
                        "Apartment 5 will reveal the spot when you have one ballon.",
                        "Apartment 6 will reveal the spot when you have two ballons.",
                        "This could be useful for repeatedly getting up the great tower. DING! SUCKA!",
                    );
                }
                else if (result === 3) {
                    yield* show("I'm the guardian of the bell. Also I know a secret about helium.", "D-D-D-DING!");
                }
                else {
                    yield* show("I love that! DING!");
                    break;
                }
            }
        })
        .mxnBallonable.setInitialBallons(ballons);
}

function enrichRoom3(lvl: LvlType.EfficientHome) {
    const angryMessages = [
        "Gah! Really?! You walk into places like that?!",
        "What did I say?!",
        "You're tracking dirt everywhere!",
    ];

    objEsotericRemovedShoes().at(lvl.RemovedShoesMarker).show();

    lvl.CloudHouseNeatFreakNpc
        .coro(function* (self) {
            while (true) {
                yield () =>
                    playerObj.x >= lvl.NeatFreakUnsafeRegion.x
                    && playerObj.speed.x > 0
                    && !Rpg.inventory.equipment.loadout.isEmpty
                    && playerObj.collides(lvl.NeatFreakUnsafeRegion);
                yield Cutscene.play(function* () {
                    yield* show(angryMessages.length > 1 ? angryMessages.shift()! : angryMessages[0]);
                    playerObj.speed.y = -2;
                    playerObj.speed.x = -6;
                    yield sleep(500);
                }, { speaker: self }).done;
            }
        })
        .mixin(mxnCutscene, function* () {
            if (!Rpg.inventory.equipment.loadout.isEmpty) {
                return;
            }

            yield* show("Thank you for not wearing your shoes in my apartment.");
            yield* DramaQuests.complete("GreatTower.EfficientHome.NeatFreak.DidntWearEquipment");
        });

    lvl.FurnitureArtworkSaying0
        .mixin(mxnSign, "...Interesting sentiment.");
}

function enrichRoom4(lvl: LvlType.EfficientHome) {
    if (Rpg.quest("GreatTower.EfficientHome.Snail.Defeated").everCompleted) {
        lvl.EnemySnail.destroy();
        return;
    }
    lvl.EnemySnail
        .handles("mxnEnemy.died", () => {
            Cutscene.play(function* () {
                yield* DramaQuests.complete("GreatTower.EfficientHome.Snail.Defeated");
            });
        });
}

function enrichRoom5(lvl: LvlType.EfficientHome) {
    function generateArtistName() {
        return Rng.choose("Reeny", "Tenly", "Ricein", "Kleeg", "Vash'norash", "Kiesen", "Chundar") + " "
            + Rng.choose("Chempsy", "Fareesh", "Pe'il'narsh", "Chuun", "Maeisin", "Tren-Lessen");
    }

    lvl.CloudHouseMusicianNpc
        .mixin(mxnCutscene, function* () {
            if (Rpg.gift("GreatTower.EfficientHome.Musician.SongShoe").isGiven) {
                yield* show("Music makes the world go round, sucka!!!");
                return;
            }

            yield* show(
                "Ugh!! I'm so obsessed with music!!!",
                "I'm literally addicted to it!!!",
            );

            yield* ask("Who is your favorite artist?", ...range(5).map(generateArtistName), "Not sure...");
            yield* show(
                `Heh, nice. Have you heard ${generateArtistName()}'s latest album?`,
                "It's FIRE!!!",
                "Anyway, I love meeting another music fan.",
                "Here, this will help you enjoy music even MORE!!!",
            );

            yield* DramaGifts.give("GreatTower.EfficientHome.Musician.SongShoe");
        });
}

function enrichRoom6(lvl: LvlType.EfficientHome) {
    const flagNerd = (() => {
        const flag = Rpg.flags.greatTower.efficientHome.nerd;
        return {
            get windEssenceCount() {
                return flag.windEssenceCount;
            },
            get downloadedBytesPerTick() {
                if (this.windEssenceCount < 1) {
                    return 0;
                }
                const value = 128 * Math.round(Math.pow(1.3, this.windEssenceCount)) + 256 * this.windEssenceCount;
                return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
            },
            addWindEssence(count: Integer) {
                flag.windEssenceCount += count;
            },
            downloadData() {
                const ticks = Rpg.records.gameTicksPlayed - flag.lastEvaluatedGameTickCount;
                if (ticks <= 0) {
                    return;
                }

                flag.downloadedData = Math.min(
                    constNerd.maxStoredBytes,
                    flag.downloadedData + ticks * this.downloadedBytesPerTick,
                );
                flag.lastEvaluatedGameTickCount = Rpg.records.gameTicksPlayed;
            },
            removeMovies() {
                const count = this.storedMoviesCount;
                flag.downloadedData -= count * constNerd.movieBytes;
                return count;
            },
            get storedMoviesCount() {
                return Math.floor(flag.downloadedData / constNerd.movieBytes);
            },
            get isAtCapacity() {
                return flag.downloadedData >= constNerd.maxStoredBytes;
            },
            get remainingBytesForNextMovie() {
                return constNerd.movieBytes - (flag.downloadedData % constNerd.movieBytes);
            },
        };
    })();

    const constNerd = {
        kilobyte: 1_000,
        megabyte: 1_000_000,
        gigabyte: 1_000_000_000,
        movieBytes: 2_000_000_000,
        maxStoredBytes: 64_000_000_000,
    };

    function bytesText(bytes: number) {
        if (bytes === 0) {
            return "0B";
        }
        if (bytes < 1) {
            return "<1B";
        }
        if (bytes < constNerd.kilobyte) {
            return Math.round(bytes) + "B";
        }
        if (bytes < constNerd.megabyte) {
            return Math.round(bytes / constNerd.kilobyte) + "KB";
        }
        if (bytes < constNerd.gigabyte) {
            return Math.round(bytes / constNerd.megabyte) + "MB";
        }
        return (bytes / constNerd.gigabyte).toFixed(1) + "GB";
    }

    {
        const loadingIndicatorTexts = ["I", "/", "-", "\\", "I", "/", "-", "\\"];

        objText.XSmall("", { tint: 0x00ff00 })
            .step(self => {
                if (flagNerd.isAtCapacity) {
                    self.text = `   
 AT MAX!`;
                    return;
                }
                let text = "";
                if (flagNerd.storedMoviesCount > 0) {
                    text += " " + flagNerd.storedMoviesCount + " done\n";
                }
                const index = Math.floor(Rpg.records.gameTicksPlayed / 4);
                const loadingIndicatorText = loadingIndicatorTexts[index % loadingIndicatorTexts.length];
                text += bytesText(flagNerd.remainingBytesForNextMovie) + " " + loadingIndicatorText + "\n";
                text += bytesText(flagNerd.downloadedBytesPerTick * 60) + "ps";
                self.text = text;
            })
            .at(lvl.NerdTerminal)
            .add(3, 3)
            .zIndexed(ZIndex.TerrainDecals)
            .show();
    }

    const turbineObjs = [lvl.TurbineMarker1, lvl.TurbineMarker2, lvl.TurbineMarker3, lvl.TurbineMarker0]
        .map(position => objCharacterWindTurbine().at(position).zIndexed(ZIndex.CharacterEntities).show());

    const rng = new PseudoRng(36969696973);

    for (let i = 0; i < turbineObjs.length; i++) {
        const obj = turbineObjs[i].mixin(mxnSoundLoop);
        const direction = rng.intp();
        obj.objCharacterWindTurbine.angle = rng.int(360);
        let turbineSpeed = 0;
        obj
            .step(() => {
                turbineSpeed = Math.max(0, Math.min(20, flagNerd.windEssenceCount * Math.pow(0.8, i) - i * 5));

                if (turbineSpeed < 1) {
                    return;
                }
                obj.objCharacterWindTurbine.angle += direction * turbineSpeed;
            })
            .coro(function* () {
                yield () => isOnScreen(obj) && turbineSpeed > 0;
                const sfx = obj.mxnSoundLoop.playInstance(Sfx.Effect.TurbineSpin.gain(0).rate(turbineSpeed / 15));
                sfx.linearRamp("gain", 0.3, 0.5);
                while (true) {
                    yield onPrimitiveMutate(() => turbineSpeed);
                    sfx.linearRamp("rate", turbineSpeed / 15, 0.5);
                }
            });
    }

    scene.stage
        .step(() => {
            if (DevKey.justWentDown("Comma")) {
                Rpg.inventory.pocket.receive("EssenceWind");
            }

            flagNerd.downloadData();
        });

    lvl.NerdTerminal
        .mixin(mxnSpeaker, { name: "Nerd Terminal", tintPrimary: 0x606060, tintSecondary: 0xAFAFAF })
        .mixin(mxnCutscene, function* () {
            if (flagNerd.storedMoviesCount < 1) {
                yield* show("Nothing downloaded yet.");
                return;
            }

            yield* show("Exporting...");
            const count = flagNerd.removeMovies();
            yield* DramaInventory.receiveItems(range(count).map(() => ({ kind: "key_item", id: "IllegalMovie" })));
            for (let i = 0; i < count; i++) {
                Rpg.experience.reward.computer.onInteract("small_task");
            }
        });

    lvl.CloudHouseNerdNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "I'm a nerd. Can I help in some way?",
                "Wind energy?",
                Rpg.inventory.pocket.has("EssenceWind", 1) ? "I have Wind Essence" : null,
                "Trade",
                "Practice quiz",
                "No, you can't",
            );

            if (result === 0) {
                yield* show("I'm glad you asked!");
                yield* DramaFacts.memorize("WindEnergy");
                yield* show("Hopefully that makes sense!");
            }
            else if (result === 1) {
                yield* show("Great! I'll use it to power up my computers.");
                const count = yield* DramaInventory.removeAll({ kind: "pocket_item", id: "EssenceWind" });
                flagNerd.addWindEssence(count);
                yield* show("This wind essence will be put to good use!");
            }
            else if (result === 2) {
                yield* dramaShop("ComputerNerd", lvl.CloudHouseNerdNpc.speaker);
            }
            else if (result === 3) {
                yield* show(
                    "You want to practice a programming quiz? Ok!",
                    "Take your time, and pay close attention to the value passed to the function.",
                );

                const correct = yield* dramaQuizComputerScience(
                    {
                        difficulty: 0,
                        messageObj: Sprite.from(Tx.Characters.NerdPortrait).anchored(0.5, 0.6),
                    },
                );

                if (correct) {
                    Rpg.experience.reward.computer.onCorrectPracticeQuizAnswer();
                    yield* show("Enjoy this little treat!");
                    yield* DramaPotions.useOnPlayer("RestoreHealth");
                }
                else {
                    yield* show("Maybe you should try again!");
                }
            }
        });
}

function enrichRoom7(lvl: LvlType.EfficientHome) {
    lvl.GamblerNote
        .mixin(mxnSpeaker, { name: "Gambler's Note", tintPrimary: 0xFF5D2B, tintSecondary: 0x640129 })
        .mixin(mxnCutscene, function* () {
            yield* objCharacterGamblingExpert.dramaShowFavoritePlaces();
        });
}
