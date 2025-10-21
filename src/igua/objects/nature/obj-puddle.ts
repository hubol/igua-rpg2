import { Graphics } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Instances } from "../../../lib/game-engine/instances";
import { approachLinear } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { MxnPhysics, mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgFaction } from "../../rpg/rpg-faction";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

export function objPuddle(width: number, tint = 0x68A8D0) {
    const attack = RpgAttack.create({
        conditions: {
            wetness: {
                value: 2,
                tint,
            },
        },
        versus: RpgFaction.Anyone,
    });
    return objPuddleBase(
        width,
        6,
        tint,
        attack,
    );
}

export function objPuddlePoison(width: number, tint = 0x80B020) {
    const attack = RpgAttack.create({
        conditions: {
            poison: {
                value: 5,
            },
            wetness: {
                value: 2,
                tint,
            },
        },
        versus: RpgFaction.Anyone,
    });
    return objPuddleBase(
        width,
        6,
        tint,
        attack,
    );
}

const filterFn = (item: MxnPhysics) => item.physicsFaction as unknown as boolean;

function objPuddleBase(width: number, height: number, tint: Integer, attack: RpgAttack.Model) {
    let stepCount = 0;

    const gfx = new Graphics().beginFill(tint)
        .drawRect(0, -1, width, height);

    const sideStepCounts = new WeakMap<object, Integer>();
    const upwardStepCounts = new WeakMap<object, Integer>();

    const bigAttack = RpgAttack.create({
        ...attack,
        conditions: {
            wetness: {
                ...attack.conditions.wetness,
                value: 30,
            },
        },
        versus: RpgFaction.Anyone,
    });

    const c = container(gfx)
        .collisionShape(CollisionShape.DisplayObjects, [gfx])
        .step(() => {
            stepCount++;

            const instances = Instances(mxnPhysics, filterFn);
            for (const obj of instances) {
                if (obj.speed.isZero || !obj.collides(c, obj.speed.y < 0 ? undefined : obj.speed)) {
                    continue;
                }

                if (obj.is(mxnRpgStatus)) {
                    obj.damage(Math.abs(obj.speed.y) > 2 ? bigAttack : attack);
                }

                if ((obj.speed.y < 0) || (!obj.isOnGround && obj.speed.y > 0)) {
                    const upwardStepCount = upwardStepCounts.get(obj);

                    if (!upwardStepCount || stepCount - upwardStepCount >= 5) {
                        upwardStepCounts.set(obj, stepCount);
                        objUpwardSplash().tinted(tint).at(obj.x - c.x, 1).show(c);
                        continue;
                    }
                }

                const sideStepCount = sideStepCounts.get(obj);

                if (!sideStepCount || stepCount - sideStepCount >= 5) {
                    sideStepCounts.set(obj, stepCount);
                }
                else {
                    continue;
                }

                if (obj.isOnGround && obj.speed.x !== 0) {
                    objSideSplash(
                        Math.sign(obj.speed.x) * Math.min(Math.abs(obj.speed.x / 2), 2),
                        width,
                    )
                        .tinted(tint)
                        .at(obj.x - c.x, Rng.intc(-1, 1)).show(c);
                }
            }
        }, -10);

    return c;
}

const txsUpwardSplash = Tx.Effects.SplashMedium.split({ count: 3 });
const txsSideSplash = Tx.Effects.SplashSmall.split({ count: 4 });

function objUpwardSplash() {
    return objEphemeralSprite(txsUpwardSplash, Rng.float(0.15, 0.25))
        .anchored(0.5, 1)
        .coro(function* (self) {
            self.play(Sfx.Fluid.SplashSmall.rate(0.95, 1.05));
        });
}

function objSideSplash(speed: number, max: number) {
    const f = Math.sin(speed * scene.ticker.ticks * 0.05) * 0.2;
    const rate = f + Math.max(0.4, Math.min(0.8, Math.abs(speed / 2)));
    Sfx.Fluid.SplashTiny.rate(rate * 0.9).play();
    let steps = 0;
    return objEphemeralSprite(txsSideSplash, Rng.float(0.15, 0.25))
        .scaled(Math.sign(speed), 1)
        .anchored(0.5, 1)
        .step(self => {
            self.x = Math.max(0, Math.min(max, self.x + speed));
            if (self.x < 8 || self.x > max - 8) {
                self.y = approachLinear(self.y, 2, steps < 2 ? 4 : 1);
            }
            steps += 1;
        });
}
