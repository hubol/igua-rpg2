import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { RpgAttack } from "../rpg/rpg-attack";

export function scnCobbler0() {
    const lvl = Lvl.Cobbler0();
    enrichGlueDripSources(lvl);
}

const atkGlueDrip = RpgAttack.create({
    conditions: {
        wetness: {
            tint: 0xffffff,
            value: 10,
        },
    },
});

function enrichGlueDripSources(lvl: LvlType.Cobbler0) {
    lvl.GlueDripSource0.atkDrip = atkGlueDrip;
    lvl.GlueDripSource1.atkDrip = atkGlueDrip;
}
