import { Sprite } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { holdf } from "../../lib/game-engine/routines/hold";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { DataPocketItem } from "../data/data-pocket-item";
import { scene } from "../globals";
import { MxnPhysics, mxnPhysics, PhysicsFaction } from "../mixins/mxn-physics";
import { RpgPocket } from "../rpg/rpg-pocket";
import { RpgProgress } from "../rpg/rpg-progress";
import { playerObj } from "./obj-player";
import { objPocketCollectNotification } from "./pocket/obj-pocket-collect-notification";

export function objPocketableItem(item: RpgPocket.Item) {
    return objPocketableItem.bouncing(item);
}

objPocketableItem.bouncing = function objPocketableItemBouncing (item: RpgPocket.Item) {
    return objPocketableItemBase(item, false).mixin(mxnBounce);
};

objPocketableItem.parachuting = function objPocketableItemParachuting (item: RpgPocket.Item) {
    return objPocketableItemBase(item, true).mixin(mxnParachute);
};

function objPocketableItemBase(item: RpgPocket.Item, freed: boolean) {
    const tx = DataPocketItem[item].texture;
    const obj = container().merge({ freed, isCollectible: false, item, tx });

    Sprite.from(tx).anchored(0.5, 0.5).coro(function* (self) {
        yield () => obj.freed;
        self.alpha = 0.5;
        yield sleepf(15);
        yield () => obj.isCollectible;
        self.alpha = 1;

        yield () => playerObj.hasControl && self.collides(playerObj);
        const result = RpgPocket.Methods.receive(RpgProgress.character.inventory.pocket, item);
        objPocketCollectNotification(result).at(obj).show();
        obj.destroy();
    }).show(obj);

    return obj;
}

type ObjPocketableItemBase = ReturnType<typeof objPocketableItemBase>;

const [txParachuteSlack, txParachute, txParachuteOpen] = Tx.Effects.Parachute.split({ count: 3 });

function objParachute(target: MxnPhysics) {
    return Sprite.from(txParachute).pivoted(30, 76).coro(function* (self) {
        self.scale.y = -1;
        yield () => target.speed.y >= -1;
        self.texture = txParachuteSlack;
        yield () => target.speed.y >= 0;
        self.texture = txParachuteSlack;
        self.scale.y = 1;
        yield sleepf(10);
        self.texture = txParachute;
        yield sleepf(15);
        self.texture = txParachuteOpen;
        yield () => target.isOnGround;
        self.texture = txParachuteSlack;
        yield sleepf(10);
        self.alpha = 0.5;
        yield sleepf(10);
        self.destroy();
    });
}

function mxnParachute(obj: ObjPocketableItemBase) {
    return obj.mixin(mxnPhysics, createPhysicsArgs(obj, 0.1))
        .coro(function* (self) {
            self.addChildAt(objParachute(self), 0);
            self.speed.y = -6;
            yield () => self.speed.y >= 0;
            self.gravity = 0.01;
            yield () => self.isOnGround;
            self.isCollectible = true;
        });
}

function mxnBounce(obj: ObjPocketableItemBase) {
    return obj.coro(function* (self) {
        yield () => (playerObj.speed.x !== 0 || playerObj.speed.y !== 0) && self.collides(playerObj);
        Sfx.Impact.PocketableItemFree.rate(0.9, 1.1).play();
        self.freed = true;

        let virtualAngle = 0;

        const physicsObj = self.mixin(mxnPhysics, createPhysicsArgs(self, 0.3))
            .step(self => {
                virtualAngle += self.speed.x * 2;
                self.angle = Math.round(virtualAngle / 45) * 45;
                self.speed.x *= 0.998;
                self.speed.x = approachLinear(self.speed.x, 0, 0.003);

                // TODO should be a mixin probably
                if (self.y >= scene.level.height + 100) {
                    self.destroy();
                }
            })
            .handles("moved", (obj, e) => {
                if (e.previousOnGround) {
                    return;
                }

                if (e.hitGround) {
                    obj.play(getBounceSfxToPlay(e.previousSpeed.y).rate(0.9, 1.1));
                    obj.speed.y = Math.abs(e.previousSpeed.y) * -0.8;
                    if (obj.speed.y > -0.5) {
                        obj.speed.y = 0;
                    }
                }
            });
        // TODO VFX
        // Bounce is kind of bad
        // Really need to figure out a smart way to compute this for many situations...
        physicsObj.speed.at(playerObj.speed);
        if (physicsObj.speed.x === 0) {
            physicsObj.speed.x = Rng.intp();
        }
        physicsObj.speed.x = Math.max(2, Math.abs(physicsObj.speed.x)) * Math.sign(physicsObj.speed.x);
        if (physicsObj.speed.y === 0) {
            physicsObj.speed.y = -1;
        }

        yield sleepf(15);
        yield holdf(() => physicsObj.isOnGround, 3);

        self.isCollectible = true;
    });
}

function getBounceSfxToPlay(vspeed: number) {
    if (vspeed > 5) {
        return Sfx.Impact.PocketableItemBounceHard;
    }
    else if (vspeed > 2) {
        return Sfx.Impact.PocketableItemBounceMedium;
    }
    return Sfx.Impact.PocketableItemBounceSoft;
}

function createPhysicsArgs(obj: ObjPocketableItemBase, gravity: number) {
    return {
        gravity,
        physicsRadius: Math.floor(obj.tx.height * 0.3),
        physicsOffset: [0, 1],
        physicsFaction: PhysicsFaction.Environment,
    };
}
