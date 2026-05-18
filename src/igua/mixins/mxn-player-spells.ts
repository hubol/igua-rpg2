import { Input } from "../globals";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";
import { objProjectileHotPineCone } from "../objects/projectiles/obj-projectile-hot-pine-cone";
import { RpgPlayerSpells } from "../rpg/rpg-player-spells";

export function mxnPlayerSpells(obj: ObjIguanaLocomotive, rpgPlayerSpells: RpgPlayerSpells) {
    return obj
        .step(() => {
            rpgPlayerSpells.tick();
            if (!Input.justWentDown("CastSpell")) {
                return;
            }
            const equippableSpells = rpgPlayerSpells.cast();
            if (!equippableSpells) {
                return;
            }

            const horizontalDirection = Math.sign(obj.speed.x) || Math.sign(obj.facing);
            const horizontalSpeed = (3 + Math.abs(obj.speed.x)) * horizontalDirection;

            const position = obj.head.mouth.getWorldCenter();

            const attacker = playerObj.status;

            if (equippableSpells.HotPineCone.isEquipped) {
                objProjectileHotPineCone({ attack: equippableSpells.HotPineCone.attack, attacker })
                    .at(position)
                    .show()
                    .speed.at(horizontalSpeed, -3);
            }
        });
}
