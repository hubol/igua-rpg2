import { Graphics } from "pixi.js";
import { ReceivesPhysicsFaction, mxnPhysicsCollideable } from "../../mixins/mxn-physics-collideable";
import { mxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { RpgAttack } from "../../rpg/rpg-attack";
import { container } from "../../../lib/pixi/container";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { Integer } from "../../../lib/math/number-alias-types";
import { CollisionShape } from "../../../lib/pixi/collision";
import { approachLinear } from "../../../lib/math/number";

const atkSplash = RpgAttack.create({
    wetness: 10,
})

export function objPuddle(width: number, height: number) {
    const gfx = new Graphics().beginFill(0x67A5CE)
    .drawRect(0, -1, width, height);

    const effectCooldowns = new Map<object, Integer>();

    const c = container(gfx)
    .collisionShape(CollisionShape.DisplayObjects, [ gfx ])
    .mixin(mxnPhysicsCollideable, { receivesPhysicsFaction: ReceivesPhysicsFaction.Any, onPhysicsCollision(event) {
        if (event.obj.is(mxnRpgStatus))
            event.obj.damage(atkSplash);

        if ((event.previousSpeed.y < 0) || (!event.previousOnGround && event.previousSpeed.y > 0)) {
            objUpwardSplash().tinted(0x67A5CE).at(event.obj.x - c.x, 1).show(c);
            return;   
        }

        const cooldown = effectCooldowns.get(event.obj);

        if (!cooldown)
            effectCooldowns.set(event.obj, 5);
        else
            return;

        if (event.previousOnGround && event.previousSpeed.x !== 0)
            objSideSplash(
                Math.sign(event.previousSpeed.x) * Math.min(Math.abs(event.previousSpeed.x / 2), 2),
                width)
            .tinted(0x67A5CE)
            .at(event.obj.x - c.x, Rng.intc(-1, 1)).show(c);
    }, })
    .step(() => {
        for (const [ obj, value ] of effectCooldowns) {
            if (value > 0)
                effectCooldowns.set(obj, value - 1);
        }
    })

    return c;
}

const txsUpwardSplash = Tx.Effects.SplashMedium.split({ count: 3 });
const txsSideSplash = Tx.Effects.SplashSmall.split({ count: 4 });

function objUpwardSplash() {
    return objEphemeralSprite(txsUpwardSplash, Rng.float(0.15, 0.25))
        .anchored(0.5, 1);
}

function objSideSplash(speed: number, max: number) {
    let steps = 0;
    return objEphemeralSprite(txsSideSplash, Rng.float(0.15, 0.25))
        .scaled(Math.sign(speed), 1)
        .anchored(0.5, 1)
        .step(self => {
            self.x = Math.max(0, Math.min(max, self.x + speed));
            if (self.x < 8 || self.x > max - 8)
                self.y = approachLinear(self.y, 2, steps < 2 ? 4 : 1);
            steps += 1;
        });
}