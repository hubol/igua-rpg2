import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
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
import { mxnRescue } from "../../mixins/mxn-rescue";
import { Rpg } from "../../rpg/rpg";
import { objFxBurst32 } from "../effects/obj-fx-burst-32";
import { objFxCollectEquipmentNotification } from "../effects/obj-fx-collect-equipment-notification";
import { objFigureEquipment } from "../figures/obj-figure-equipment";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const appearTxs = Tx.Effects.EquipmentAppear.split({ width: 40 });

// TODO doesn't support levels
export function objCollectibleEquipment(equipmentId: DataEquipment.Id) {
    const figureObj = objFigureEquipment(equipmentId, 1);
    let physicsRadius = 13;

    if (figureObj instanceof Sprite) {
        figureObj.trimmed();
        physicsRadius = Math.floor(figureObj.texture.height / 2);
    }

    figureObj.pivotedUnit(0.5, 0.5);

    let hitSolidCount = 0;

    return container()
        .mixin(mxnCollectibleLoot)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius, physicsOffset: [0, -3] })
        .mixin(mxnRescue)
        .handles("moved", (self, event) => {
            const hitGround = event.hitGround && !event.previousOnGround;
            const hitWall = event.hitWall && event.previousSpeed.x !== 0;

            if (hitGround || hitWall) {
                const sfxRate = Math.max(0.5, Math.min(2, Math.abs(event.previousSpeed.y) / 3) + Rng.float(-0.1, 0.1));
                self.play(Sfx.Collect.EquipmentLand.rate(sfxRate));
                objFxBurst32().tinted(0xE5BB00).at(self).add(0, 10).show();
                hitSolidCount++;
            }

            if (hitGround) {
                if (event.previousSpeed.y > 1) {
                    self.speed.y = -event.previousSpeed.y * 0.8;
                    self.speed.x = approachLinear(event.previousSpeed.x * 0.8, 0, 0.1);
                }
                else {
                    self.speed.x = 0;
                }
            }
            if (hitWall) {
                self.speed.x = -event.previousSpeed.x;
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
                Coro.chain([sleep(250), () => hitSolidCount > 0]),
                sleep(1000),
            ]);
            appearObj.destroy();
            const filter = new ForceTintFilter(0xAD3600);
            figureObj.show(self).filters = [filter];

            self.coro(function* () {
                yield sleep(250);
                yield () => self.mxnCollectibleLoot.collectConditionsMet;
                objFxCollectEquipmentNotification().at(self).show();
                Rpg.inventory.equipment.receive(equipmentId, 1);
                self.destroy();
            });

            yield interp(filter, "factor").steps(4).to(0).over(1000);
            figureObj.filters = null;
        });
}
