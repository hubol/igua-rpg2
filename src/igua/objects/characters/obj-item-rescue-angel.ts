import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { approachLinear, nlerp } from "../../../lib/math/number";
import { Rng } from "../../../lib/math/rng";
import { vdir } from "../../../lib/math/vector";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { scene } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objFxFormativeBurst } from "../effects/obj-fx-formative-burst";
import { StepOrder } from "../step-order";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [propellerTx0, propellerTx1, propellerTx2, bagTx, legsTx, armTx, dressTx, nogginTx, faceTx] = Tx.Characters
    .ItemRescueAngel.split({
        width: 74,
    });

function objItemAngelPuppet() {
    const api = {
        animatePivot: true,
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
        .merge({ objItemAngelPuppet: api })
        .step(self => {
            if (api.animatePivot) {
                self.pivot.y = Math.round(Math.sin(scene.ticker.ticks * 0.1) * 3);
            }
        });
}

function objItemAngelCommon() {
    const puppetObj = objItemAngelPuppet().invisible();

    const api = {
        flapSfxBaseRate: 1,
        puppetObj,
        get isReady() {
            return puppetObj.visible;
        },
    };

    return container(puppetObj)
        .pivoted(21, 65)
        .merge({ objItemAngelCommon: api })
        .coro(function* (self) {
            while (true) {
                yield () => self.visible;
                self.play(Sfx.Character.RescueAngelFlap.rate(api.flapSfxBaseRate + Rng.float(-.1, .1)));
                yield sleepf(8);
            }
        })
        .coro(function* (self) {
            self.play(Sfx.Character.RescueAngelAppear.rate(0.95, 1.05));
            objFxFormativeBurst().at(33, 33).show(self);
            yield sleep(500);
            puppetObj.visible = true;
        });
}

const v = vnew();

export function objItemRescueAngel(rescueObj: DisplayObject, towSpeed: VectorSimple, objCenterOffset: VectorSimple) {
    function getTargetPosition() {
        return v.at(rescueObj.getWorldPosition()).add(objCenterOffset);
    }

    const state = {
        isRescued: false,
    };

    return objItemAngelCommon()
        .merge({ state })
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 8 })
        .coro(function* (self) {
            yield () => self.objItemAngelCommon.isReady;
            yield sleep(333);

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
                    yield () =>
                        (aliveBehaviorObj.previousDistance < 60 || aliveBehaviorObj.isOutsideLevel)
                        && (!rescueObj.is(objItemRescueAngel.mxnRescueStatus)
                            || !rescueObj.mxnRescueStatus.isBeingRescued);

                    if (rescueObj.is(objItemRescueAngel.mxnRescueStatus)) {
                        rescueObj.mxnRescueStatus.rescuerObj = self;
                    }

                    aliveBehaviorObj.speed = 0;
                    self.speed.at(0, 0);
                    yield interpvr(self).factor(factor.sine).to(rescueObj).over(500);
                    self.objItemAngelCommon.flapSfxBaseRate = 0.8;
                    state.isRescued = true;
                    self.objItemAngelCommon.puppetObj.objItemAngelPuppet.animatePivot = false;
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
            yield* self.objItemAngelCommon.puppetObj.objItemAngelPuppet.removeBag();

            self.objItemAngelCommon.flapSfxBaseRate = 1;

            self.speed.at(0, -0.5);
            self.step(self => self.speed.y -= 0.1);

            yield () => self.y <= -100;
            self.destroy();
        });
}

objItemRescueAngel.mxnRescueStatus = function mxnRescueStatus (obj: DisplayObject) {
    const api = {
        rescuerObj: Null<DisplayObject>(),
        get isBeingRescued() {
            return this.rescuerObj && !this.rescuerObj.destroyed;
        },
    };

    return obj.merge({ mxnRescueStatus: api });
};
