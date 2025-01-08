import { Sprite, Texture } from "pixi.js";
import { RpgPocket } from "../rpg/rpg-pocket";
import { Tx } from "../../assets/textures";
import { playerObj } from "./obj-player";
import { mxnPhysics } from "../mixins/mxn-physics";
import { Rng } from "../../lib/math/rng";
import { RpgProgress } from "../rpg/rpg-progress";
import { DataPocketItem } from "../data/data-pocket-item";

export function objPocketableItem(item: RpgPocket.Item) {
    const tx = DataPocketItem[item].texture;
    return Sprite.from(tx).anchored(0.5, 0.5).coro(function* (self) {
        yield () => (playerObj.speed.x !== 0 || playerObj.speed.y !== 0) && self.collides(playerObj);

        let doneBouncing = false;

        const physicsObj = self.mixin(mxnPhysics, {
            gravity: 0.3,
            physicsRadius: Math.floor(tx.height * 0.3),
            physicsOffset: [0, 1],
        })
            .handles("moved", (_, e) => {
                if (e.previousOnGround) {
                    return;
                }

                if (e.hitGround) {
                    physicsObj.speed.at(e.previousSpeed.x * 0.8, Math.abs(e.previousSpeed.y) * -0.8);
                    if (physicsObj.speed.vlength < 2) {
                        physicsObj.speed.vlength = 0;
                        doneBouncing = true;
                    }
                }
            });
        physicsObj.speed.at(playerObj.speed);
        if (physicsObj.speed.x === 0) {
            physicsObj.speed.x = Rng.intp();
        }
        if (physicsObj.speed.y === 0) {
            physicsObj.speed.y = -1;
        }
        physicsObj.alpha = 0.5;
        yield () => doneBouncing;
        physicsObj.alpha = 1;

        yield () => self.collides(playerObj);
        RpgPocket.Methods.receive(RpgProgress.character.inventory.pocket, item);
        self.destroy();
    });
}
