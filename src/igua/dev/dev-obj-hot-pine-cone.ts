import { Rng } from "../../lib/math/rng";
import { objProjectileCrackedEarthExpanding } from "../objects/projectiles/obj-projectile-cracked-earth-expanding";
import { objProjectileHotPineCone } from "../objects/projectiles/obj-projectile-hot-pine-cone";
import { objProjectilePuddleDrip } from "../objects/projectiles/obj-projectile-puddle-drip";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";

export function devObjHotPineCone() {
    const obj = objProjectilePuddleDrip({
        attack: RpgAttack.create({
            physical: 40,
            versus: RpgFaction.Anyone,
            conditions: {
                wetness: {
                    tint: 0xf0f000,
                    value: 2,
                },
            },
        }),
    });

    obj.speed.at(Rng.float(-5, 5), -3);

    return obj;

    return objProjectileHotPineCone();
}
