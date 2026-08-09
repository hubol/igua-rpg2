import { DisplayObject } from "pixi.js";
import { Instances } from "../../../lib/game-engine/instances";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { DataItem } from "../../data/data-item";
import { RpgInventory } from "../../rpg/rpg-inventory";
import { objDroppedItem } from "../obj-dropped-item";
import { StepOrder } from "../step-order";
import { objItemAngelCommon } from "./obj-item-angel-common";

const v = vnew();

export function objItemAngelDropper(receiverObj: DisplayObject, item: RpgInventory.Item) {
    const angelObj = objItemAngelCommon();
    let droppedItemObj = Null<DisplayObject>();

    const api = {
        isTargeting(obj: DisplayObject): boolean {
            if (receiverObj !== obj) {
                return false;
            }

            if (droppedItemObj?.destroyed) {
                return false;
            }

            if (!droppedItemObj && angelObj.destroyed) {
                return false;
            }

            if (droppedItemObj?.y ?? Number.MIN_SAFE_INTEGER > receiverObj.getWorldBounds().bottom + 16) {
                return false;
            }

            return true;
        },
    };

    return angelObj
        .merge({ objItemAngelDropper: api })
        .coro(function* (self) {
            yield () => self.objItemAngelCommon.isReady;
            const figureObj = DataItem
                .getFigureObj(item)
                .pivotedUnit(0.5, 0.5)
                .step(() => {
                    if (self.destroyed) {
                        figureObj.destroy();
                        return;
                    }

                    figureObj.at(self);
                }, StepOrder.BeforeCamera)
                .show();

            const moveObj = container()
                .step(() => self.moveTowards(v.at(receiverObj).add(0, -130), 2))
                .show(self);

            yield () => Math.abs(self.x - receiverObj.x) < 5;

            moveObj.destroy();

            yield sleep(100);

            figureObj.destroy();
            objDroppedItem(item)
                .at(self)
                .show();

            self
                .step(() => self.y -= 2);

            yield () => self.y < -100;
            self.destroy();
        })
        .track(objItemAngelDropper);
}

objItemAngelDropper.areAnyTargeting = function areAnyTargeting (obj: DisplayObject) {
    for (const dropperObj of Instances(objItemAngelDropper)) {
        if (dropperObj.objItemAngelDropper.isTargeting(obj)) {
            return true;
        }
    }

    return false;
};
