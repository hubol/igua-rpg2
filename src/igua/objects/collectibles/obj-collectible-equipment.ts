import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { DataEquipment } from "../../data/data-equipment";
import { mxnCollectible } from "../../mixins/mxn-collectible";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { Rpg } from "../../rpg/rpg";
import { objEquipmentRepresentation } from "../obj-equipment-representation";

// TODO very sad
export function objCollectibleEquipment(equipmentId: DataEquipment.Id) {
    let angle = 0;

    return objEquipmentRepresentation(equipmentId)
        .pivoted(16, 16)
        .mixin(mxnCollectible, { kind: "transient" })
        .handles("collected", () => Rpg.character.equipment.receive(equipmentId))
        .merge({ collectable: false })
        .mixin(mxnPhysics, { gravity: 0.1, physicsRadius: 13 })
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
