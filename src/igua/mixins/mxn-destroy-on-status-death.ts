import { DisplayObject } from "pixi.js";
import { objFxOwnerDefeat } from "../objects/effects/obj-fx-owner-defeat";
import { RpgStatus } from "../rpg/rpg-status";

export function mxnDestroyOnStatusDeath(obj: DisplayObject, status: RpgStatus.Model) {
    return obj
        .step((self) => {
            if (status.health <= 0) {
                objFxOwnerDefeat().at(self.getWorldPosition()).show();
                self.destroy();
            }
        });
}
