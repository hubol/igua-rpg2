import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { ZIndex } from "../core/scene/z-index";
import { ask } from "../drama/show";
import { objFxPoisonCloud } from "../objects/effects/obj-fx-poison-cloud";
import { ObjDoor } from "../objects/obj-door";
import { playerObj } from "../objects/obj-player";
import { RpgAttack } from "../rpg/rpg-attack";
import { mxnFxSpawnMany } from "./effects/mxn-fx-spawn-many";
import { mxnDoorAutoUnlock } from "./mxn-door-auto-unlock";

export function mxnDoorPoisonous(doorObj: ObjDoor) {
    let isOpened = false;

    doorObj.speaker.name = "Suspicious Door";

    const fxSpawnState = {
        perFrame: 0,
        spawnObj: () => objFxPoisonCloud().zIndexed(ZIndex.FrontDecals),
    };

    doorObj.objDoor.lockedCutscene = function* () {
        if (yield* ask("The stench of poison is present. Open anyway?")) {
            Sfx.Esoteric.PoisonousDoorOpen.rate(0.95, 1.05).play();
            isOpened = true;
            playerObj.damage(atkPoison);
            doorObj
                .coro(function* () {
                    fxSpawnState.perFrame = 0.2;
                    yield interp(fxSpawnState, "perFrame").to(0).over(2000);
                });
        }
    };

    return doorObj
        .mixin(mxnFxSpawnMany, fxSpawnState)
        .mixin(mxnDoorAutoUnlock, () => !isOpened);
}

const atkPoison = RpgAttack.create({
    conditions: {
        poison: {
            value: 100,
        },
    },
    quirks: {
        ignoreCutscenePlaying: true,
    },
});
