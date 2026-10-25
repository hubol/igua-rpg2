import { Sprite } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp, interpc, interpvr } from "../../lib/game-engine/routines/interp";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
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
import { mxnEsotericMeowable } from "./esoteric/mxn-esoteric-meowable";
import { mxnDestroyAfterSteps } from "./mxn-destroy-after-steps";
import { mxnMotion } from "./mxn-motion";
import { mxnRpgAttack } from "./mxn-rpg-attack";

export function mxnPlayerSpells(obj: ObjIguanaLocomotive, rpgPlayerSpells: RpgPlayerSpells) {
    return obj
        .step(() => {
            rpgPlayerSpells.tick();
            if (!Input.justWentDown("CastSpell")) {
                return;
            }
            const cast = rpgPlayerSpells.cast();
            if (!cast) {
                return;
            }

            // TODO use cost to show that a charge was consumed
            const { cost, spells } = cast;

            const horizontalDirection = Math.sign(obj.speed.x) || Math.sign(obj.facing);
            const horizontalSpeed = 3 + Math.abs(obj.speed.x);
            const horizontalSpeedScaled = horizontalSpeed * horizontalDirection;

            let syllables = 0;

            const position = vnew(obj.head.mouth.getWorldCenter());

            const attacker = playerObj.status;

            if (spells.HotPineCone.isEquipped) {
                objProjectileHotPineCone({
                    attack: spells.HotPineCone.attack,
                    attacker,
                    destroyAfterStepsCount: 180,
                })
                    .at(position)
                    .show()
                    .speed.at(horizontalSpeedScaled, -3);
            }

            if (spells.OpenFlopBlindBoxes.isEquipped) {
                const flopIds = openFlopBlindBoxes(4 + spells.OpenFlopBlindBoxes.level);

                if (flopIds.length === 0) {
                    obj.play(Sfx.Interact.Error);
                    Sprite.from(Tx.Ui.NoBlindBoxes)
                        .anchored(0.5, 1)
                        .at(position)
                        .tinted(0x404069)
                        .coro(function* (self) {
                            yield* Coro.all([
                                interpvr(self.pivot).factor(factor.sine).to(0, 37).over(333),
                                interpc(self, "tint").steps(3).to(0xCECEE4).over(666),
                            ]);
                        })
                        .mixin(mxnDestroyAfterSteps, 180)
                        .show();
                }

                for (const flopId of flopIds) {
                    objCollectibleFlop(flopId)
                        .mixin(mxnRpgAttack, {
                            attack: spells.OpenFlopBlindBoxes.attack,
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

            if (spells.Meow.isEquipped) {
                syllables = Math.max(1, syllables);
                obj.play(Sfx.Iguana.Meow.rate(0.95, 1.05));
                Sprite.from(Tx.Ui.Meow)
                    .anchored(0.5, 0.5)
                    .at(position)
                    .mixin(mxnMotion)
                    .step(self => self.speed.x = approachLinear(self.speed.x, 0, 0.05))
                    .coro(function* (self) {
                        yield sleepf(40);
                        self.alpha = 0.5;
                        yield sleepf(10);
                        self.destroy();
                    })
                    .show()
                    .speed.at(Math.sign(obj.facing) * 2, -1);
                for (const meowableObj of obj.collidesAll(Instances(mxnEsotericMeowable))) {
                    meowableObj.dispatch("mxnEsotericMeowable:meow");
                }
            }

            if (syllables > 0) {
                obj
                    .coro(function* () {
                        for (let i = 0; i < syllables; i++) {
                            yield interp(obj.head.mouth, "agape").to(1).over(300);
                            yield interp(obj.head.mouth, "agape").to(0).over(300);
                        }
                    });
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
