import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { DevKey, Input, scene } from "../../globals";
import { objAngelSnail } from "../../objects/enemies/obj-angel-snail";
import { playerObj } from "../../objects/obj-player";
import { Rpg } from "../../rpg/rpg";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgStatus } from "../../rpg/rpg-status";

export function scnDevSnail() {
    Lvl.Dummy();

    objAngelSnail().at(playerObj).add(90, 0).show();

    scene.stage
        .step(() => {
            if (DevKey.isDown("KeyA")) {
                playerObj.damage(RpgAttack.create({ conditions: { helium: 100 } }));
            }
        });
}
