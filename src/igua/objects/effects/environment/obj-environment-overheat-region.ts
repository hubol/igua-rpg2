import { OgmoEntities } from "../../../../assets/generated/levels/generated-ogmo-project-data";
import { RpgAttack } from "../../../rpg/rpg-attack";
import { RpgFaction } from "../../../rpg/rpg-faction";
import { objProjectileCrackedEarth } from "../../projectiles/obj-projectile-cracked-earth";

const atk = RpgAttack.create({
    conditions: {
        overheat: {
            damage: 50,
            value: 1,
        },
    },
    versus: RpgFaction.Anyone,
});

export function objEnvironmentOverheatRegion(entity: OgmoEntities.OverheatRegion) {
    const width = entity.width!;
    delete entity.width;

    return objProjectileCrackedEarth(width, atk);
}
