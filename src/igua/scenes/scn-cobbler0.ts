import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { dramaShop } from "../drama/drama-shop";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgAttack } from "../rpg/rpg-attack";

export function scnCobbler0() {
    const lvl = Lvl.Cobbler0();
    enrichGlueDripSources(lvl);
    enrichGluemaker(lvl);
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

function enrichGluemaker(lvl: LvlType.Cobbler0) {
    lvl.GlueMakerNpc.mixin(mxnCutscene, function* () {
        yield* dramaShop("Gluemaker", { primaryTint: 0x100327, secondaryTint: 0xD1EBFF });
    });
}
