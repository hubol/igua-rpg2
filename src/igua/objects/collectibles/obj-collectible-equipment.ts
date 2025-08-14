import { Sprite } from "pixi.js";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { DataEquipment } from "../../data/data-equipment";
import { mxnCollectible } from "../../mixins/mxn-collectible";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { Rpg } from "../../rpg/rpg";
import { objFigureEquipment } from "../figures/obj-figure-equipment";

// TODO very sad
export function objCollectibleEquipment(equipmentId: DataEquipment.Id) {
    let angle = 0;

    const figureObj = objFigureEquipment(equipmentId);
    let physicsRadius = 13;

    if (figureObj instanceof Sprite) {
        figureObj.trimmed().anchored(0.5, 0.5);
        physicsRadius = Math.floor(Math.min(figureObj.texture.width, figureObj.texture.height) / 2);
    }
    else {
        figureObj.pivoted(16, 16);
    }

    return figureObj
        .mixin(mxnCollectible, { kind: "transient" })
        .handles("collected", () => Rpg.inventory.equipment.receive(equipmentId))
        .merge({ collectable: false })
        .mixin(mxnPhysics, { gravity: 0.1, physicsRadius })
        .handles("moved", (self, event) => {
            if (event.hitGround) {
                if (event.previousSpeed.y > 1) {
                    self.speed.y = -event.previousSpeed.y * 0.8;
                    self.speed.x = approachLinear(event.previousSpeed.x * 0.8, 0, 0.1);
                }
                else {
                    self.speed.x = 0;
                    self.angle = Math.ceil(angle / 90) * 90;
                }
            }
        })
        .step(self => {
            if (self.speed.x === 0) {
                return;
            }
            angle += self.speed.x;
            self.angle = Math.round(angle / 45) * 45;
        })
        .scaled(0.5, 0.5)
        .coro(function* (self) {
            yield sleep(250);
            self.scaled(1, 1);
            yield sleep(500);
            self.collectable = true;
        });
}
