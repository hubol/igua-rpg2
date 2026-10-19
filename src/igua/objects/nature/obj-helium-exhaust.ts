import { Graphics } from "pixi.js";
import { Instances } from "../../../lib/game-engine/instances";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { Check } from "../../../lib/types/check";
import { DataTemporaryEffect } from "../../data/data-temporary-effect";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { mxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { Rpg } from "../../rpg/rpg";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objFxHelium } from "../effects/obj-fx-helium";
import { playerObj } from "../obj-player";

const atkHeliumExhaust = RpgAttack.create({
    conditions: {
        helium: 1,
    },
});

const atkHeliumExhaustQuick = RpgAttack.create({
    conditions: {
        helium: 4,
    },
});

export function objHeliumExhaust() {
    const hitboxObj = new Graphics().beginFill().drawRect(-16, -32, 32, 32).invisible();

    const api = {
        mode: Check<"default" | "heal" | DataTemporaryEffect.Id>("default"),
    };

    let quick = false;

    const state = {
        get quick() {
            return quick;
        },
        set quick(value) {
            quick = value;
            obj.attack = quick ? atkHeliumExhaustQuick : atkHeliumExhaust;
        },
    };

    const obj = container(hitboxObj)
        .collisionShape(CollisionShape.DisplayObjects, [hitboxObj])
        .mixin(mxnRpgAttack, { attack: atkHeliumExhaust })
        .step(self => {
            if (!self.isAttackActive || api.mode !== "heal") {
                return;
            }

            for (const statusObj of self.collidesAll(Instances(mxnRpgStatus))) {
                statusObj.heal(1);
            }
        })
        .step(self => {
            if (!self.isAttackActive || api.mode === "heal" || api.mode === "default") {
                return;
            }

            if (self.collides(playerObj)) {
                Rpg.character.temporaryEffects.add(api.mode, 60);
            }
        })
        .coro(function* (self) {
            while (true) {
                yield () => self.isAttackActive;
                let variantId: objFxHelium.VariantId = "helium";
                if (api.mode === "heal") {
                    if (Rng.bool()) {
                        variantId = "heart";
                    }
                }
                else if (api.mode !== "default" && Rng.bool()) {
                    variantId = "mystery";
                }
                objFxHelium(variantId).at(self).add(Rng.intc(-16, 16), 0).show();
                yield sleep(Rng.intc(80, 120));
            }
        });

    return obj.merge({ state, objHeliumExhaust: api });
}
