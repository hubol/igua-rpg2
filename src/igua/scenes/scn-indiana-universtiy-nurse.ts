import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { ZIndex } from "../core/scene/z-index";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objCharacterDoctorSprite } from "../objects/characters/obj-character-doctor-sprite";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIndianaUniversityNurse() {
    const lvl = Lvl.IndianaUniversityNurse();
    enrichNurseNpc(lvl);
    enrichDoctorNpc(lvl);
}

function enrichDoctorNpc(lvl: LvlType.IndianaUniversityNurse) {
    const obj = objCharacterDoctorSprite();

    obj
        .mixin(mxnSpeaker, { name: "Doctor Sprite", colorPrimary: 0x21AA0D, colorSecondary: 0xEAEA1E })
        .mixin(mxnCutscene, function* () {
            yield* show("okkkk");
            yield interp(obj.objCharacterDoctorSprite.controls, "armUnit").to(1).over(500);
            yield* show("Drink responsibly!");
            yield interp(obj.objCharacterDoctorSprite.controls, "armUnit").to(0).over(500);
        })
        .at(lvl.DoctorSpriteMarker)
        .add(0, 3)
        .zIndexed(ZIndex.Entities)
        .show();
}

function enrichNurseNpc(lvl: LvlType.IndianaUniversityNurse) {
    lvl.NurseNpc.mixin(mxnCutscene, function* () {
        const result = yield* ask(
            "Hello.",
            Rpg.character.status.conditions.poison.level ? "I'm poisoned" : null,
            "Spirit tax",
        );
        if (result === 0) {
            if (Rpg.character.status.conditions.poison.level > 1) {
                yield* show("Yes, let me help!");
                playerObj.isBeingPiloted = true;
                playerObj.isDucking = true;
                yield sleep(1000);
                while (Rpg.character.status.conditions.poison.level > 1) {
                    // TODO sfx
                    Rpg.character.status.conditions.poison.level -= 1;
                    yield sleep(500);
                }
                yield* show("Ah, this is a pretty severe case.");
                playerObj.isBeingPiloted = false;
                yield sleep(1000);
            }

            yield* show(
                "I'm sorry. There's only so much I can do.",
                "The healer underneath New Balltown has powerful medicine to cure poison.",
                "Also, if it is any comfort, poison is not fatal.",
            );
        }
        else if (result === 1) {
            yield* show(
                "When you are fatally injured, you become a spirit.",
                "Your valuables and pocket items are permanently lost and turned into spirit experience.",
                "The sprite doctor can dispense valuable items in return for this experience.",
            );
        }
    });
}
