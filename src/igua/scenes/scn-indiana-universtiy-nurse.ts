import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objCharacterDoctorSprite } from "../objects/characters/obj-character-doctor-sprite";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIndianaUniversityNurse() {
    Jukebox.play(Mzk.DespicableMessage);
    const lvl = Lvl.IndianaUniversityNurse();
    enrichNurseNpc(lvl);
    enrichDoctorNpc(lvl);
    enrichDoor(lvl);
}

function enrichDoor(lvl: LvlType.IndianaUniversityNurse) {
    if (Rpg.character.position.checkpointName !== "restart") {
        return;
    }

    lvl.Door.locked = true;

    lvl.Door
        .coro(function* (self) {
            for (let i = 5; i >= 1; i--) {
                lvl.Door.lockedMessage = `Let's get ready!
Please perform ${i} pushup(s) to unlock.`;
                yield () => playerObj.ducking >= 1;
                yield () => playerObj.ducking <= 0;
                self.mixin(mxnNudgeAppear);
                self.play(Sfx.Cutscene.DoorPushup.rate((5 - i) * 0.1 + 1));
            }

            lvl.Door.unlock();
        });
}

function enrichDoctorNpc(lvl: LvlType.IndianaUniversityNurse) {
    const obj = objCharacterDoctorSprite();

    obj
        .mixin(mxnSpeaker, { name: "Doctor Sprite", colorPrimary: 0x21AA0D, colorSecondary: 0xEAEA1E })
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("Can I help you?", "About this", "Trade", "Respawn location");
            if (result === 0) {
                yield* show(
                    "Sorry, I'm not particularly good at talking with patients.",
                    "Please feel free to ask the nurse any questions.",
                );
            }
            else if (result === 1) {
                yield* dramaShop("DoctorSprite", { primaryTint: 0x21AA0D, secondaryTint: 0xEAEA1E });
            }
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
            "About death",
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
            );
        }
        else if (result === 1) {
            yield* show(
                "When you are fatally injured, you become a spirit.",
                "Your valuables and pocket items are permanently lost and turned into spirit experience.",
                "The sprite doctor can dispense useful items in return for this experience.",
            );
        }
    });
}
