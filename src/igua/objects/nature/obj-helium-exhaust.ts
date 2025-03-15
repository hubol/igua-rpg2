import { Graphics } from "pixi.js";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objFxHelium } from "../effects/obj-fx-helium";

const atkHeliumExhaust = RpgAttack.create({
    conditions: {
        helium: 1,
    },
});

export function objHeliumExhaust() {
    const hitboxObj = new Graphics().beginFill().drawRect(-16, -32, 32, 32).invisible();

    return container(hitboxObj)
        .collisionShape(CollisionShape.DisplayObjects, [hitboxObj])
        .mixin(mxnRpgAttack, { attack: atkHeliumExhaust })
        .coro(function* (self) {
            while (true) {
                yield () => self.isAttackActive;
                objFxHelium().at(self).add(Rng.intc(-16, 16), 0).show();
                yield sleep(Rng.intc(80, 120));
            }
        });
}
