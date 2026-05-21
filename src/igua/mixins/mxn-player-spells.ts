import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { range } from "../../lib/range";
import { Input } from "../globals";
import { objCollectibleFlop } from "../objects/collectibles/obj-collectible-flop";
import { objFxHeart, ObjFxHeartArgs } from "../objects/effects/obj-fx-heart";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";
import { objProjectileHotPineCone } from "../objects/projectiles/obj-projectile-hot-pine-cone";
import { Rpg } from "../rpg/rpg";
import { RpgFlopBlindBox } from "../rpg/rpg-flop-blind-box";
import { RpgFlops } from "../rpg/rpg-flops";
import { RpgPlayerSpells } from "../rpg/rpg-player-spells";
import { mxnRpgAttack } from "./mxn-rpg-attack";

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
            const horizontalSpeed = 3 + Math.abs(obj.speed.x);
            const horizontalSpeedScaled = horizontalSpeed * horizontalDirection;

            const position = obj.head.mouth.getWorldCenter();

            const attacker = playerObj.status;

            if (equippableSpells.HotPineCone.isEquipped) {
                objProjectileHotPineCone({
                    attack: equippableSpells.HotPineCone.attack,
                    attacker,
                    destroyAfterStepsCount: 180,
                })
                    .at(position)
                    .show()
                    .speed.at(horizontalSpeedScaled, -3);
            }

            if (equippableSpells.OpenFlopBlindBoxes.isEquipped) {
                const flopIds = openFlopBlindBoxes(4 + equippableSpells.OpenFlopBlindBoxes.level);
                for (const flopId of flopIds) {
                    objCollectibleFlop(flopId)
                        .mixin(mxnRpgAttack, {
                            attack: equippableSpells.OpenFlopBlindBoxes.attack,
                            attacker,
                            damageTargetsOnce: true,
                        })
                        .handles("mxnRpgAttack.hit", (self) =>
                            objFxHeart.objBurst(5, 3, objFxHeartEmotionalArgs)
                                .at(self.getWorldCenter())
                                .show())
                        .at(position)
                        .show()
                        .speed.x = Rng.float(1, horizontalSpeed) * horizontalDirection * 0.67;
                }
            }
        });
}

const objFxHeartEmotionalArgs: ObjFxHeartArgs = {
    tintStart: 0x404069,
    tintEnd: 0xCECEE4,
};

function openFlopBlindBoxes(maxCount: Integer): Array<RpgFlops.Id> {
    const result = new Array<RpgFlops.Id>();
    for (const id of RpgFlopBlindBox.keyItemIds) {
        const removeCount = Math.max(0, Math.min(Rpg.inventory.keyItems.count(id), maxCount - result.length));
        if (removeCount === 0) {
            continue;
        }
        Rpg.inventory.keyItems.remove(id, removeCount);
        result.push(...range(removeCount).map(() => RpgFlopBlindBox.open(id)));
    }
    return result;
}
