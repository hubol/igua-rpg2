import { objProjectileCrackedEarthExpanding } from "../objects/projectiles/obj-projectile-cracked-earth-expanding";
import { RpgAttack } from "../rpg/rpg-attack";

export function devObjHotPineCone() {
    return objProjectileCrackedEarthExpanding({
        attack: RpgAttack.create({}),
        expandDirection: "both",
        expandSpeed: 8,
        maxWidth: 96,
    });
}
