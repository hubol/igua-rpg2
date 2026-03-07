import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [txLegs, ...txsString] = Tx.Characters.EmoBallista.Body.split({ width: 94 });

export function objCharacterEmoBallista() {
    const attacks = new Array<RpgAttack.Model>();

    const api = {
        fire: (attack: RpgAttack.Model) => {
            attacks.push(attack);
        },
    };

    const stringObj = objIndexedSprite(txsString);
    return container(
        Sprite.from(txLegs),
        stringObj,
    )
        .mixin(mxnSpeaker, { name: "Emo Ballista", colorPrimary: 0x404069, colorSecondary: 0xCECEE4 })
        .pivoted(47, 34)
        .coro(function* (self) {
            while (true) {
                yield () => attacks.length > 0;
                const attack = attacks.shift()!;
                const boltObj = Sprite.from(Tx.Characters.EmoBallista.Bolt)
                    .at(self)
                    .add(-88, -48)
                    .pivoted(0, 32)
                    .zIndexed(ZIndex.CharacterEntities)
                    .show();
                boltObj.alpha = 0;
                yield* Coro.all([
                    interp(boltObj, "alpha").steps(3).to(1).over(500),
                    interpvr(boltObj.pivot).to(0, 0).over(500),
                ]);
                boltObj
                    .step(self => {
                        self.x -= 3;
                        if (self.x < -200) {
                            self.destroy();
                        }
                    });
                yield interp(stringObj, "textureIndex").to(txsString.length).over(125);
                boltObj
                    .mixin(mxnRpgAttack, { attack })
                    .handles("mxnRpgAttack.hit", (self) => self.destroy());
                yield sleep(300);
                yield interp(stringObj, "textureIndex").to(0).over(500);
            }
        })
        .zIndexed(ZIndex.Entities)
        .merge({ objCharacterEmoBallista: api });
}
