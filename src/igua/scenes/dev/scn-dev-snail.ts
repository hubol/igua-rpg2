import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { show } from "../../drama/show";
import { DevKey, Input, scene } from "../../globals";
import { mxnCuesheet } from "../../mixins/mxn-cuesheet";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnInteract } from "../../mixins/mxn-interact";
import { objCharacterKingSpino } from "../../objects/characters/obj-character-king-spino";
import { objAngelSnail } from "../../objects/enemies/obj-angel-snail";
import { playerObj } from "../../objects/obj-player";
import { Rpg } from "../../rpg/rpg";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgStatus } from "../../rpg/rpg-status";

export function scnDevSnail() {
    Lvl.Dummy();

    objCharacterKingSpino()
        .mixin(mxnCutscene, function* () {
            yield* show("Hi sucker");
        })
        .at(playerObj)
        .scaled(-1, 1)
        .show();

    // objAngelSnail().at(playerObj).add(90, 0).show();

    // scene.stage
    //     .step(() => {
    //         if (DevKey.isDown("KeyA")) {
    //             playerObj.damage(RpgAttack.create({ conditions: { helium: 100 } }));
    //         }
    //     });
}
