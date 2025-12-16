import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { ask, show } from "../drama/show";
import { Cutscene, layers } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objHolyIguana } from "../objects/characters/obj-holy-iguana";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnRaceTrack() {
    Rpg.character.status.conditions.poison.level = 10;
    const lvl = Lvl.RaceTrack();
    // objGhostRecord(lvl).show();
    objGhostPlayback(lvl).show();
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

    const iguanaObj = objHolyIguana("Hubol");

    const iguanaObj2 = iguanaObj
        .mixin(mxnCutscene, function* () {
            if (Rpg.character.status.conditions.poison.level !== 10) {
                yield* show(
                    "Hey kid, I'll race you, but you need to be poisoned ten times. Or there is just no point.",
                );
                return;
            }
            if (yield* ask("Nice, you're poisoned. Want to race?")) {
                yield* show("Cool. Rev up your engines!!!!");
                playerObj.at(lvl.PlayerStartMarker);
                playerObj.auto.facing = 1;
                yield sleep(3000);
                startRace();
            }
            else {
                yield* show("Suit yourself!");
            }
        })
        .at(data[0]);

    const startRace = () => {
        iguanaObj2.interact.enabled = false;
        iguanaObj2.coro(function* (self) {
            yield () => !Cutscene.isPlaying;
            let previous = 0;
            for (const [x, y, time] of data) {
                yield interpvr(self).to(x, y).over((time - previous) * 1000 / 60);
                previous = time;
            }
        });
    };

    return iguanaObj2;
}
