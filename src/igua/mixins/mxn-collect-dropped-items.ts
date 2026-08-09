import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { holdf } from "../../lib/game-engine/routines/hold";
import { Rng } from "../../lib/math/rng";
import { DataPotion } from "../data/data-potion";
import { scene } from "../globals";
import { objItemAngelDropper } from "../objects/characters/obj-item-angel-dropper";
import { objFxHeart } from "../objects/effects/obj-fx-heart";
import { objValuableSparkle } from "../objects/effects/obj-valuable-sparkle";
import { objDroppedItem } from "../objects/obj-dropped-item";
import { mxnRpgStatusPotions } from "./mxn-rpg-status-potions";

function skipDeflectedItems(obj: objDroppedItem.Type) {
    return !obj.objDroppedItem.isDeflected;
}

export function mxnCollectDroppedItems(obj: DisplayObject) {
    const api = {
        get isTargetedForDrop(): boolean {
            return objItemAngelDropper.areAnyTargeting(obj);
        },
    };

    return obj
        .merge({ mxnCollectDroppedItems: api })
        .coro(function* (self) {
            while (true) {
                yield holdf(() => {
                    const droppedItemObj = self.collidesOne(Instances(objDroppedItem, skipDeflectedItems));
                    if (!droppedItemObj) {
                        return false;
                    }

                    if (scene.ticker.ticks % 5 === 0) {
                        objValuableSparkle()
                            .at(droppedItemObj)
                            .add(Rng.vunit().scale(Rng.float(6, 12)))
                            .show();
                    }
                    return true;
                }, 60);
                const droppedItemObj = self.collidesOne(Instances(objDroppedItem, skipDeflectedItems));
                if (!droppedItemObj) {
                    continue;
                }

                const item = droppedItemObj.objDroppedItem.item;
                let heartTint = 0xffffff;

                if (item.kind === "potion" && self.is(mxnRpgStatusPotions)) {
                    self.mxnRpgStatusPotions.heldPotionIds.push(item.id);
                    heartTint = DataPotion.getById(item.id).stinkLineTint;
                }
                // TODO something with other kinds?

                self.play(Sfx.Effect.CollectDroppedItem.rate(0.9, 1.1));

                objFxHeart.objBurst(10, 4, { tintStart: heartTint, tintEnd: heartTint })
                    .at(droppedItemObj)
                    .show();
                droppedItemObj.destroy();
            }
        });
}
