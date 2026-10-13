import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { blendColor } from "../../lib/color/blend-color";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { approachLinear, cyclic } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { Vector, vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { Input, layers, scene } from "../globals";
import { mxnActionRepeater } from "../mixins/mxn-action-repeater";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objEsotericPokeOverlay } from "../objects/esoteric/obj-esoteric-poke-overlay";
import { EsotericPokeData } from "../objects/esoteric/poke/esoteric-poke-data";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";
import { Rpg } from "../rpg/rpg";
import { RpgFlops } from "../rpg/rpg-flops";
import { DramaLib } from "./drama-lib";

function* askFlopImpl(availableFlopIds: ReadonlyArray<RpgFlops.Id>, config?: DramaFlops.askFlop.Config) {
    const askObj = container()
        .show(layers.overlay.messages);

    const bubbleObj = objFlopSpeechBubble()
        .at(262, 0)
        .pivoted(0, 108)
        .coro(function* (self) {
            yield interpvr(self.pivot).factor(factor.sine).to(0, 0).over(400);
        })
        .show(askObj);

    const flopWheelObj = objFlopWheel(availableFlopIds, { radius: 100 })
        .at(-100, 130)
        .mixin(mxnHudModifiers.mxnHideStatus)
        .show(askObj);

    if (config?.showPokeSpeciesStatistics) {
        container()
            .coro(function* (self) {
                while (true) {
                    self.removeAllChildren();
                    const species = EsotericPokeData.Species.createFromFlopId(flopWheelObj.objFlopWheel.selectedFlopId);
                    objEsotericPokeOverlay.objStatistics.objFromSpecies(species)
                        .show(self);
                    yield onPrimitiveMutate(() => flopWheelObj.objFlopWheel.selectedFlopId);
                }
            })
            .at(295, 120)
            .show(askObj);
    }

    Sfx.Ui.Flops.AskWhichEnter.rate(0.99, 1.01).play();

    yield interpvr(flopWheelObj).factor(factor.sine).to(142, 130).over(500);
    flopWheelObj.objFlopWheel.isReady = true;

    yield () => !Input.isDown("Confirm");
    yield () => Input.isDown("Confirm");

    Sfx.Ui.Flops.AskWhichExit.rate(0.99, 1.01).play();

    flopWheelObj.objFlopWheel.isConfirmed = true;
    yield interpvr(bubbleObj).translate(0, -120).over(500);
    yield sleep(1000);
    askObj.destroy();

    return flopWheelObj.objFlopWheel.selectedFlopId;
}

function objFlopWheel(rawAvailableFlopIds: ReadonlyArray<RpgFlops.Id>, config: objFlopWheel.Config) {
    const availableFlopIds = [...new Set(rawAvailableFlopIds)]
        .sort((a, b) => a - b);

    const api = {
        isConfirmed: false,
        isReady: false,
        get selectedFlopId() {
            return availableFlopIds[state.selectedIndex];
        },
    };

    const state = {
        selectedIndex: 0,
    };

    const drawData = new Array<drawWheelSlice.Data>();

    const slicesCount = availableFlopIds.length;
    const pointsCount = Math.max(2, 180 / slicesCount);

    for (let i = 0; i < slicesCount; i++) {
        const id = availableFlopIds[i];
        const points: drawWheelSlice.Data["points"] = [];

        for (let j = 0; j <= pointsCount; j++) {
            const f = Math.PI * 2 * (i + (j / pointsCount)) / slicesCount;
            points.push([Math.sin(f) * config.radius, -Math.cos(f) * config.radius]);
        }

        drawData.push({
            color: objFigureFlop.primaryTints[id],
            points,
            rotation: Math.PI * 2 * (i + 0.5) / slicesCount,
            isCircle: slicesCount === 1,
        });
    }

    const wheelObj = new Graphics()
        .coro(function* (self) {
            yield () => api.isConfirmed;
            self.step(() => self.angle += 2);
            yield interpv(self.scale).to(0, 0).over(500);
        });
    const shadowObj = new Graphics()
        .step(self => self.visible = !api.isConfirmed && api.isReady);

    const highlightObj = new Graphics()
        .step(self => self.visible = !api.isConfirmed && api.isReady)
        .step(self => {
            if (!self.visible) {
                return;
            }
            self.pivot.y = approachLinear(self.pivot.y, 8, 1);
            flopContainerObj.pivot.at(self.pivot);
        }, 1);
    const arrowObj = Sprite.from(Tx.Ui.Dialog.WhichFlopArrow)
        .merge({ objArrow: { targetPosition: Null<Vector>() } })
        .step(self => {
            if (self.objArrow.targetPosition) {
                const d = distance(self.objArrow.targetPosition, self);
                self.moveTowards(self.objArrow.targetPosition, 1 + d / 8);
            }
        })
        .coro(function* (self) {
            while (true) {
                self.pivot.at(0, 0);
                yield interpvr(self.pivot).factor(factor.sine).to(-7, 0).over(400);
            }
        })
        .step(self => self.visible = !api.isConfirmed && api.isReady)
        .anchored(0, 0.5);

    for (const data of drawData) {
        wheelObj.lineStyle(slicesCount < 90 ? 3 : 1, data.color, 1, 0.5);
        wheelObj.beginFill(data.color);
        drawWheelSlice(wheelObj, data);
    }

    const flopContainerObj = container()
        .coro(function* (self) {
            yield () => api.isConfirmed;
            self.step(() => self.pivot.y = Math.sin(scene.ticker.ticks / 6) * 3);
            yield* Coro.all([
                interpvr(self).factor(factor.sine).to(0, 0).over(500),
                interpv(self.scale).steps(2).to(2, 2).over(500),
            ]);
        });

    return container(
        wheelObj,
        shadowObj,
        arrowObj,
        highlightObj,
        flopContainerObj,
    )
        .mixin(mxnActionRepeater, ["SelectLeft", "SelectRight"])
        .step(self => {
            if (api.isConfirmed || !api.isReady) {
                return;
            }

            const previousSelectedIndex = state.selectedIndex;

            if (self.mxnActionRepeater.justWentDown("SelectLeft")) {
                state.selectedIndex -= 1;
            }
            if (self.mxnActionRepeater.justWentDown("SelectRight")) {
                state.selectedIndex += 1;
            }

            if (state.selectedIndex === previousSelectedIndex) {
                return;
            }

            Sfx.Ui.Flops.AskWhichSelect.rate(0.5, 1.3).play();
            state.selectedIndex = cyclic(state.selectedIndex, 0, availableFlopIds.length);
        })
        .coro(function* () {
            while (true) {
                highlightObj.clear();
                highlightObj.lineStyle(1, 0xffffff, 1, 1);

                shadowObj.clear();

                flopContainerObj.removeAllChildren();

                const data = drawData[state.selectedIndex];
                if (data) {
                    const position = vnew(Math.sin(data.rotation), -Math.cos(data.rotation)).scale(config.radius + 1);
                    if (arrowObj.objArrow.targetPosition) {
                        arrowObj.objArrow.targetPosition.at(position);
                    }
                    else {
                        arrowObj.at(position);
                        arrowObj.objArrow.targetPosition = position;
                    }
                    arrowObj.rotation = Math.round((data.rotation - Math.PI / 2) / (Math.PI / 6)) * Math.PI / 6;
                    highlightObj.beginFill(data.color);
                    highlightObj.pivoted(0, 0);

                    shadowObj.lineStyle(1, blendColor(data.color, 0x000000, 0.5), 1, 1);
                    shadowObj.beginFill(0x000000);

                    drawWheelSlice(highlightObj, data);
                    drawWheelSlice(shadowObj, data);

                    flopContainerObj.position.at(position).scale(0.5).add(0, -16);
                    objFigureFlop.objFiltered(api.selectedFlopId).show(flopContainerObj);
                }
                yield onPrimitiveMutate(() => state.selectedIndex);
            }
        })
        .merge({ objFlopWheel: api });
}

namespace objFlopWheel {
    export interface Config {
        radius: Integer;
    }
}

function drawWheelSlice(gfx: Graphics, data: drawWheelSlice.Data) {
    let moved = false;
    if (!data.isCircle) {
        gfx.moveTo(0, 0);
        moved = true;
    }

    for (const [x, y] of data.points) {
        if (!moved) {
            gfx.moveTo(x, y);
            moved = true;
        }
        else {
            gfx.lineTo(x, y);
        }
    }

    const [x, y] = data.isCircle ? data.points[0] : [0, 0];
    gfx.lineTo(x, y);
}

namespace drawWheelSlice {
    export interface Data {
        color: RgbInt;
        points: Array<[x: Integer, y: Integer]>;
        rotation: number;
        isCircle: boolean;
    }
}

const txsWhichFlopText = Tx.Ui.Dialog.WhichFlopText.split({ width: 130 });

function objFlopSpeechBubble() {
    const colors = DramaLib.Speaker.getColors();

    return container(
        Sprite.from(Tx.Ui.Dialog.WhichFlopSpeechBubble)
            .tinted(colors.primary)
            .at(0, -12),
        container(
            ...txsWhichFlopText.map(tx =>
                Sprite.from(tx)
                    .tinted(colors.textPrimary)
                    .mixin(mxnSinePivot)
            ),
        )
            .at(36, 5),
    );
}

askFlopImpl.fromInventory = function* askFlopFromInventory (config?: DramaFlops.askFlop.Config) {
    return yield* askFlopImpl(Rpg.inventory.flops.availableFlopIds, config);
};

export namespace DramaFlops {
    export const askFlop = askFlopImpl;

    export namespace askFlop {
        export interface Config {
            showPokeSpeciesStatistics?: boolean;
        }
    }
}
