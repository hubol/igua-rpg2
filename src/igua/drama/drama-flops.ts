import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { cyclic } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { Vector, VectorSimple, vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { Input, layers } from "../globals";
import { mxnActionRepeater } from "../mixins/mxn-action-repeater";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";
import { RpgFlops } from "../rpg/rpg-flops";

// TODO implement
function* askFlop(flopAvailabilities: ReadonlyArray<boolean>) {
    const flopGridObj = objFlopWheel(flopAvailabilities, { radius: 100 })
        .at(100, 100)
        .show(layers.overlay.messages);
    yield () => !Input.isDown("Confirm");
    yield () => Input.isDown("Confirm");
    flopGridObj.destroy();
}

function objFlopWheel(flopAvailabilities: ReadonlyArray<boolean>, config: objFlopWheel.Config) {
    const api = {
        get selectedFlopId() {
            return availableFlopIds[state.selectedIndex];
        },
    };

    const state = {
        selectedIndex: 0,
    };

    const availableFlopIds = flopAvailabilities
        .flatMap((isAvailable, id) => isAvailable ? [id] : []);

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

    const wheelObj = new Graphics();
    const highlightObj = new Graphics();
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
        .anchored(0, 0.5);

    for (const data of drawData) {
        wheelObj.lineStyle(1, data.color, 1, 0.5);
        wheelObj.beginFill(data.color);
        drawWheelSlice(wheelObj, data);
    }

    return container(
        wheelObj,
        highlightObj,
        arrowObj,
    )
        .mixin(mxnActionRepeater, ["SelectLeft", "SelectRight"])
        .step(self => {
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

            state.selectedIndex = cyclic(state.selectedIndex, 0, availableFlopIds.length);
        })
        .coro(function* () {
            while (true) {
                highlightObj.clear();
                highlightObj.lineStyle(1, 0xffffff, 1, 1);
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
                    drawWheelSlice(highlightObj, data);
                }
                yield onPrimitiveMutate(() => state.selectedIndex);
            }
        });
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

function objFlopGrid(flopAvailabilities: ReadonlyArray<boolean>) {
    const margin = 1;
    const scale = 6;
    const row = 31;

    function getLocalSpaceXY(i: Integer) {
        const x = i % row;
        const y = Math.floor(i / row);
        return [x * (scale + margin), y * (scale + margin)];
    }

    function getFlopIdFromLocalSpace(x: number, y: number) {
        x = Math.max(0, Math.min(row - 1, Math.floor(x / (margin + scale))));
        y = Math.max(0, Math.min(Math.floor(999 / row), Math.floor(y / (margin + scale))));
        return y * row + x;
    }

    let cursorFlopId = 0;

    const controls = {
        get cursorFlopId() {
            return cursorFlopId;
        },
        set cursorFlopId(value: RpgFlops.Id) {
            console.log(value);
            if (!flopAvailabilities[value]) {
                return;
            }
            cursorGfx
                .tinted(objFigureFlop.primaryTints[value])
                .at(getLocalSpaceXY(value))
                .visible = true;
            cursorFlopId = value;
        },
    };

    const gfx = new Graphics();
    for (let i = 0; i < 999; i++) {
        const { x, y } = getLocalSpaceXY(i);

        gfx.beginFill(flopAvailabilities[i] ? objFigureFlop.primaryTints[i] : 0x000000)
            .drawRect(x, y, scale, scale);
    }

    const cursorGfx = new Graphics()
        .lineStyle(1, 0xffffff)
        .drawRect(-margin - 2, -margin - 2, scale + margin * 2 + 4, scale + margin * 2 + 4)
        .beginFill(0xffffff)
        .drawRect(
            -margin,
            -margin,
            scale + margin * 2,
            scale + margin * 2,
        )
        .invisible();

    const speed = vnew();

    const ghostEyedropperObj = Sprite.from(Tx.Ui.Eyedropper)
        .pivoted(1, 22);

    ghostEyedropperObj.alpha = 0.5;

    const eyedropperObj = Sprite.from(Tx.Ui.Eyedropper)
        .pivoted(1, 22)
        .step(self => {
            speed.at(0, 0);

            if (Input.isDown("SelectLeft")) {
                speed.x -= 1;
            }
            if (Input.isDown("SelectRight")) {
                speed.x += 1;
            }
            if (Input.isDown("SelectUp")) {
                speed.y -= 1;
            }
            if (Input.isDown("SelectDown")) {
                speed.y += 1;
            }

            if (speed.vlength > 0) {
                self.add(speed.normalize().scale(2));
            }
            else {
                self.at(getLocalSpaceXY(cursorFlopId)).add(margin / 2, margin / 2).vround();
            }

            controls.cursorFlopId = getFlopIdFromLocalSpace(self.x, self.y);

            ghostEyedropperObj.at(getLocalSpaceXY(cursorFlopId)).add(margin / 2, margin / 2).vround();
        });

    return container(gfx, cursorGfx, ghostEyedropperObj, eyedropperObj)
        .merge({ controls });
}

export const DramaFlops = {
    askFlop,
};
