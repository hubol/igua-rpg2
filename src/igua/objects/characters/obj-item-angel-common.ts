import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objFxFormativeBurst } from "../effects/obj-fx-formative-burst";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [propellerTx0, propellerTx1, propellerTx2, bagTx, legsTx, armTx, dressTx, nogginTx, faceTx] = Tx.Characters
    .ItemRescueAngel.split({
        width: 74,
    });

export function objItemAngelCommon() {
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
