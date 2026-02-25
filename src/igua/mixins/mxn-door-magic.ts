import { Integer } from "../../lib/math/number-alias-types";
import { DramaInventory } from "../drama/drama-inventory";
import { show } from "../drama/show";
import { ObjDoor } from "../objects/obj-door";
import { Rpg } from "../rpg/rpg";
import { mxnDoorAutoUnlock } from "./mxn-door-auto-unlock";

export function mxnDoorMagic(obj: ObjDoor, uid: Integer) {
    return obj
        .mixin(mxnDoorAutoUnlock, () => !Rpg.programmaticFlags.unlockedMagicDoorUids.has(uid))
        .coro(function* () {
            obj.speaker.name = "Magic Door";
            obj.speaker.colorPrimary = 0x202470;
            obj.speaker.colorSecondary = 0x4146A8;
            obj.objDoor.style = "Magic";
            obj.objDoor.lockedCutscene = function* () {
                yield* show("Sealed by magic.");
                const offer = yield* DramaInventory.askWhichToOffer([{ kind: "key_item", id: "MagicKey" }]);
                if (offer) {
                    Rpg.programmaticFlags.unlockedMagicDoorUids.add(uid);
                }
            };
        });
}
