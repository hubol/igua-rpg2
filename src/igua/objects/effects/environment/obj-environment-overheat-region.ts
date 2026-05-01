import { Graphics } from "pixi.js";
import { OgmoEntities } from "../../../../assets/generated/levels/generated-ogmo-project-data";
import { mxnRpgAttack } from "../../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../../rpg/rpg-attack";

const atk = RpgAttack.create({
    conditions: {
        overheat: {
            damage: 50,
            value: 1,
        },
    },
});

export function objEnvironmentOverheatRegion(entity: OgmoEntities.OverheatRegion) {
    return new Graphics().beginFill(0xff0000).drawRect(0, 0, 1, 1).invisible()
        .mixin(mxnRpgAttack, { attack: atk });
}
