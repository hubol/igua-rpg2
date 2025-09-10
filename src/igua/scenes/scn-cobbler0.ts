import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaEquipment } from "../drama/drama-equipment";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnAlternatePivot } from "../mixins/mxn-alternate-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { RpgAttack } from "../rpg/rpg-attack";

export function scnCobbler0() {
    Jukebox.play(Mzk.PieShake);
    const lvl = Lvl.Cobbler0();
    enrichGlueDripSources(lvl);
    enrichGluemaker(lvl);
    enrichCobbler(lvl);
    lvl.LittleAngel.mixin(mxnSinePivot);
    lvl.LittleAngelShadow.mixin(mxnAlternatePivot);
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

function enrichCobbler(lvl: LvlType.Cobbler0) {
    lvl.CobblerNpc.mixin(mxnCutscene, function* () {
        yield* DramaEquipment.upgrade();
    });
}

function enrichGluemaker(lvl: LvlType.Cobbler0) {
    lvl.GlueMakerNpc.mixin(mxnCutscene, function* () {
        const result = yield* ask(
            "I make the glue around here! What can I do for ya?",
            "Buy glue",
            "About glue",
            "Nothing, sorry!",
        );

        if (result === 0) {
            yield* dramaShop("Gluemaker", { primaryTint: 0x100327, secondaryTint: 0xD1EBFF });
        }
        else if (result === 1) {
            yield* show(
                "Oh, you don't know what glue is good for?",
                "You can use shoe glue to combine two of the same shoes into one, powering them up.",
                "And I will trade it for several currencies. Please take a look.",
            );
        }
        else if (result === 2) {
            yield* show("No need to apologize, sucka!");
        }
    });
}
