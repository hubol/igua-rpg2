import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { DataCuesheet } from "../data/data-cuesheet";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene, layers } from "../globals";
import { mxnFxNoise } from "../mixins/effects/mxn-fx-noise";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnIguanaHoly } from "../mixins/mxn-iguana-holy";
import { objAnnouncer } from "../objects/characters/obj-announcer";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnRaceTrack() {
    // Rpg.character.status.conditions.poison.level = 10;
    const lvl = Lvl.RaceTrack();
    // objGhostRecord(lvl).show();
    enrichMysteriousIguana(lvl);
    objGhostPlayback(lvl).show();

    lvl.RestartGroup.children.forEach(obj => obj.mixin(mxnBoilPivot));
}

function enrichMysteriousIguana(lvl: LvlType.RaceTrack) {
    lvl.MysteriousNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I couldn't reproduce it.",
                "I restarted the services.",
                "It seemed to go away.",
                "The tests all pass.",
                "And when I'm done for the day,",
                "I will have gay sex.",
            );

            yield* DramaQuests.complete("RaceTrack.MysteriousIguana");
        })
        .mixin(mxnFxNoise);
}

function objGhostRecord(lvl: LvlType.RaceTrack) {
    let stepsCount = 0;

    const events = (() => {
        const list: Array<[x: number, y: number, step: number]> = [];

        objText.Large().step(self => self.text = String(list.length)).show(layers.overlay.messages);

        return {
            push() {
                list.push([playerObj.x, playerObj.y, stepsCount]);
            },
            print() {
                console.log(list);
            },
        };
    })();

    return container()
        .coro(function* (self) {
            yield sleepf(1);
            playerObj.at(lvl.GhostStartMarker);
            yield () => playerObj.speed.x > 0;
            self.step(() => stepsCount++);

            const eventsObj = container()
                .coro(function* () {
                    while (true) {
                        yield () => playerObj.isOnGround;
                        events.push();
                        yield () => !playerObj.isOnGround;
                        events.push();
                        yield () => playerObj.speed.y >= 0;
                        events.push();
                    }
                })
                .coro(function* () {
                    const v0 = vnew();
                    const v1 = vnew();
                    while (true) {
                        yield () => playerObj.isOnGround;
                        const start = playerObj.vcpy();
                        const positions = vnew();
                        let samples = 0;
                        yield () => {
                            if (!playerObj.isOnGround) {
                                return true;
                            }

                            samples++;
                            positions.add(playerObj);

                            if (samples < 2) {
                                return false;
                            }

                            const length = v0.at(positions).scale(1 / samples).add(start, -1).normalize().add(
                                v1.at(playerObj).add(start, -1).normalize(),
                                -1,
                            ).vlength;

                            return length > 0.05;
                        };
                        if (playerObj.isOnGround) {
                            events.push();
                        }
                    }
                })
                .show(self);

            yield () => playerObj.isOnGround && playerObj.collides(lvl.WinRegion);
            eventsObj.destroy();
            events.push();
            events.print();
        });
}

function objGhostPlayback(lvl: LvlType.RaceTrack) {
    const data = [
        [161, 379, 2],
        [436, 396, 48],
        [630, 486, 73],
        [846, 440, 101],
        [1071, 515, 130],
        [1081, 512, 131],
        [1372, 457, 163],
        [1665, 571, 200],
        [1675, 568, 201],
        [1991, 508, 236],
        [2196, 557, 262],
        [2506, 453, 302],
        [2685, 379, 325],
        [3018, 376, 368],
        [3196, 342, 391],
        [3343, 379, 410],
        [3353, 376, 411],
        [3549, 345, 432],
        [3702, 379, 450],
        [3712, 376, 451],
        [3907, 347, 472],
        [4133, 411, 499],
        [4143, 408, 500],
        [4338, 379, 521],
        [4524, 419, 543],
        [4534, 416, 544],
        [4790, 370, 572],
        [5125, 515, 614],
        [5135, 512, 615],
        [5392, 466, 643],
        [5595, 523, 668],
        [5604, 520, 669],
        [5800, 491, 690],
        [6111, 611, 728],
        [6475, 608, 775],
        [6738, 555, 809],
        [6738, 555, 809],
        [6771, 552, 813],
        [7087, 499, 848],
        [7087, 499, 848],
        [7595, 499, 913],
        [7595, 499, 913],
        [7781, 555, 937],
        [7851, 555, 946],
        [7851, 555, 946],
        [7936, 555, 957],
        [8076, 552, 975],
        [8347, 499, 1010],
        [8347, 499, 1010],
        [8680, 496, 1053],
        [8928, 443, 1085],
        [8928, 443, 1085],
        [9370, 440, 1142],
        [9533, 409, 1163],
        [9680, 443, 1181],
    ];

    let state: "initial" | "racing" | "player_lost" | "player_won" | "player_rewarded" = "initial";

    const iguanaObj = objIguanaNpc("Olympian")
        .mixin(mxnIguanaHoly)
        .mixin(mxnCutscene, function* () {
            if (state === "racing") {
                return;
            }

            if (state === "player_lost") {
                yield* show("Sorry kid, you lost.", "Jump into the pit to try again.");
                return;
            }

            if (state === "player_won") {
                yield* show("Congrantulations!", "You are awesome.");
                yield* DramaQuests.complete("RaceTrack.WonRace");
                state = "player_rewarded";
                return;
            }

            if (state === "player_rewarded") {
                yield* show("I hope you enjoy your prize.");
                return;
            }

            if (Rpg.character.status.conditions.poison.level !== 10) {
                yield* show(
                    "Hey kid, I'll race you, but you need to be poisoned ten times. Or there is just no point.",
                );
                return;
            }
            if (yield* ask("Nice, you're poisoned. Want to race?")) {
                yield* show("Cool. Rev up your engines!!!!");
                playerObj.x = lvl.PlayerStartMarker.x;
                playerObj.auto.facing = 1;

                const readySetGoSfx = Sfx.Character.AnnouncerReadySetGo.playInstance();
                const announcerObj = objAnnouncer(readySetGoSfx, DataCuesheet.ReadySetGo)
                    .at(playerObj)
                    .add(20, 290)
                    .show();

                yield interpvr(announcerObj).factor(factor.sine).translate(0, -150).over(200);

                yield sleep(2800);

                announcerObj.coro(function* (self) {
                    yield interpvr(announcerObj).factor(factor.sine).translate(0, 200).over(200);
                    self.destroy();
                });

                startRace();
            }
            else {
                yield* show("Suit yourself!");
            }
        })
        .step(self => self.interact.enabled = state !== "racing")
        .at(data[0])
        .zIndexed(ZIndex.TerrainDecals);

    function startRace() {
        state = "racing";
        iguanaObj
            .coro(function* (self) {
                yield () => !Cutscene.isPlaying;
                let previous = 0;
                for (const [x, y, time] of data) {
                    const ms = (time - previous) * 1000 / 60;
                    if (ms > 300) {
                        yield interpvr(self).to(x, y).over(ms);
                    }
                    else {
                        yield interpvr(self).factor(factor.sine).to(x, y).over(ms);
                    }
                    previous = time;
                }
            })
            .step(() => {
                if (state !== "racing") {
                    return;
                }
                if (playerObj.collides(lvl.WinRegion)) {
                    state = "player_won";
                }
                else if (iguanaObj.collides(lvl.WinRegion)) {
                    state = "player_lost";
                }
            });
    }

    return iguanaObj;
}
