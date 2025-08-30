import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { ForceTintFilter } from "../../../lib/pixi/filters/force-tint-filter";
import { DataEquipment } from "../../data/data-equipment";
import { mxnCollectibleLoot } from "../../mixins/mxn-collectible-loot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { Rpg } from "../../rpg/rpg";
import { objFxBurst32 } from "../effects/obj-fx-burst-32";
import { objFigureEquipment } from "../figures/obj-figure-equipment";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const appearTxs = Tx.Effects.EquipmentAppear.split({ width: 40 });

export function objCollectibleEquipment(equipmentId: DataEquipment.Id) {
    const figureObj = objFigureEquipment(equipmentId);
    let physicsRadius = 13;

    if (figureObj instanceof Sprite) {
        figureObj.trimmed();
        physicsRadius = Math.floor(figureObj.texture.height / 2);
    }

    figureObj.pivotedUnit(0.5, 0.5);

    let hitGroundCount = 0;

    return container()
        .mixin(mxnCollectibleLoot)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius, physicsOffset: [0, -3] })
        .handles("moved", (self, event) => {
            if (event.hitGround && !event.previousOnGround) {
                objFxBurst32().tinted(0xE5BB00).at(self).add(0, 10).show();
                hitGroundCount++;
                if (event.previousSpeed.y > 1) {
                    self.speed.y = -event.previousSpeed.y * 0.8;
                    self.speed.x = approachLinear(event.previousSpeed.x * 0.8, 0, 0.1);
                }
                else {
                    self.speed.x = 0;
                }
            }
        })
        .coro(function* (self) {
            const appearObj = objIndexedSprite(appearTxs).anchored(0.5, 0.5).show(self);
            yield sleep(250);
            appearObj.textureIndex = 1;
            yield sleep(250);
            self.speed.y = Rng.float(-1, -3);
            self.speed.x = Rng.float(1, 2) * Rng.intp();
            self.gravity = 0.1;
            yield* Coro.race([
                Coro.chain([sleep(250), () => hitGroundCount > 0]),
                sleep(1000),
            ]);
            appearObj.destroy();
            const filter = new ForceTintFilter(0xAD3600);
            figureObj.show(self).filters = [filter];
            yield interp(filter, "factor").steps(4).to(0).over(1000);
            figureObj.filters = null;
            yield () => self.mxnCollectibleLoot.collectConditionsMet;
            Rpg.inventory.equipment.receive(equipmentId);
            self.destroy();
        });
}
