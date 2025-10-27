import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Integer } from "../../lib/math/number-alias-types";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Input, layers } from "../globals";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";
import { RpgFlops } from "../rpg/rpg-flops";

// TODO implement
function* askFlop(flopAvailabilities: ReadonlyArray<boolean>) {
    const flopGridObj = objFlopGrid(flopAvailabilities).show(layers.overlay.messages);
    yield () => !Input.isDown("Confirm");
    yield () => Input.isDown("Confirm");
    flopGridObj.destroy();
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
