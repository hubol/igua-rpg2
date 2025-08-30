import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { vdir } from "../../../lib/math/vector";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { StepOrder } from "../step-order";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [propellerTx0, propellerTx1, propellerTx2, bagTx, legsTx, armTx, dressTx, nogginTx, faceTx] = Tx.Characters
    .ItemRescueAngel.split({
        width: 74,
    });

function objItemRescueAngelPuppet() {
    const controls = {
        animatePivot: true,
    };

    const coros = {
        *removeBag() {
            yield interp(bagObj, "alpha").steps(2).to(0).over(333);
            yield sleep(333);
            yield interpvr(armObj).factor(factor.sine).translate(34, 0).over(333);
        },
    };

    const armMaskObj = new Graphics().beginFill(0xff0000).drawRect(12, 29, 34, 21);
    const armObj = Sprite.from(armTx).masked(armMaskObj);
    const bagObj = Sprite.from(bagTx);

    return container(
        objIndexedSprite([propellerTx0, propellerTx1, propellerTx2, propellerTx1])
            .step(self => self.textureIndex = (self.textureIndex + 0.2) % self.textures.length),
        Sprite.from(legsTx).mixin(mxnBoilPivot),
        bagObj,
        armObj,
        armMaskObj,
        Sprite.from(dressTx),
        Sprite.from(nogginTx),
        Sprite.from(faceTx).mixin(mxnSinePivot),
    )
        .step(self => {
            if (controls.animatePivot) {
                self.pivot.y = Math.round(Math.sin(scene.ticker.ticks * 0.1) * 3);
            }
        })
        .merge({ controls, coros });
}

const v = vnew();

export function objItemRescueAngel(rescueObj: DisplayObject, towSpeed: VectorSimple, objCenterOffset: VectorSimple) {
    function getTargetPosition() {
        return v.at(rescueObj.getWorldPosition()).add(objCenterOffset);
    }

    const puppetObj = objItemRescueAngelPuppet();

    const state = {
        isRescued: false,
    };

    return container(puppetObj)
        .pivoted(21, 65)
        .merge({ state })
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 8 })
        .coro(function* (self) {
            self.physicsEnabled = false;

            const aliveBehaviorObj = container()
                .merge({
                    direction: Math.PI,
                    targetDirection: Math.PI,
                    speed: 1,
                    previousDistance: Number.MAX_VALUE,
                    isOutsideLevel: false,
                })
                .step((aliveBehaviorObj) => {
                    if (rescueObj.destroyed) {
                        aliveBehaviorObj.destroy();
                        return;
                    }

                    if ("speed" in rescueObj && "x" in (rescueObj.speed as VectorSimple)) {
                        (rescueObj.speed as VectorSimple).x = 0;
                        (rescueObj.speed as VectorSimple).y = 0;
                    }

                    if (rescueObj.is(mxnPhysics)) {
                        rescueObj.physicsEnabled = false;
                        rescueObj.gravity = 0;
                    }

                    if (aliveBehaviorObj.speed > 0) {
                        const offset = getTargetPosition().add(self, -1);

                        aliveBehaviorObj.targetDirection = vdir(offset);

                        const distance = offset.vlength;
                        const noise = distance < 60
                            ? 0
                            : Math.sin(scene.ticker.ticks * 0.1) * Math.min(distance / 120, Math.PI / 4);

                        aliveBehaviorObj.direction = approachLinear(
                            aliveBehaviorObj.direction,
                            aliveBehaviorObj.targetDirection + noise,
                            Math.PI / 16,
                        );

                        self.speed
                            .at(Math.cos(aliveBehaviorObj.direction), -Math.sin(aliveBehaviorObj.direction))
                            .scale(aliveBehaviorObj.speed);

                        aliveBehaviorObj.previousDistance = distance;
                    }

                    if (self.x < -84) {
                        self.x = -84;
                        aliveBehaviorObj.isOutsideLevel = true;
                    }
                    else if (self.x > scene.level.width + 84) {
                        self.x = scene.level.width + 84;
                        aliveBehaviorObj.isOutsideLevel = true;
                    }

                    if (self.y < -84) {
                        self.y = -84;
                        aliveBehaviorObj.isOutsideLevel = true;
                    }
                    else if (self.y > scene.level.height + 84) {
                        self.y = scene.level.height + 84;
                        aliveBehaviorObj.isOutsideLevel = true;
                    }
                })
                .coro(function* (aliveBehaviorObj) {
                    yield () => aliveBehaviorObj.previousDistance < 60 || aliveBehaviorObj.isOutsideLevel;
                    aliveBehaviorObj.speed = 0;
                    self.speed.at(0, 0);
                    yield interpvr(self).factor(factor.sine).to(rescueObj).over(500);
                    state.isRescued = true;
                    puppetObj.controls.animatePivot = false;
                    aliveBehaviorObj.step(() => {
                        if (!rescueObj.destroyed) {
                            rescueObj.at(self).add(objCenterOffset);
                        }
                    }, StepOrder.AfterPhysics);
                    self.speed.at(towSpeed);
                })
                .show(self);

            yield () => aliveBehaviorObj.destroyed;
            aliveBehaviorObj.destroy();
            yield* puppetObj.coros.removeBag();

            self.speed.at(0, -0.5);
            self.step(self => self.speed.y -= 0.1);

            yield () => self.y <= -100;
            self.destroy();
        });
}
