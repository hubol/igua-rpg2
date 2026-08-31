import { DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { ZIndex } from "../core/scene/z-index";
import { DataKeyItem } from "../data/data-key-item";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DataShop } from "../data/data-shop";
import { DramaInventory } from "../drama/drama-inventory";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnEsotericBreakGlassAndSeek } from "../mixins/esoteric/mxn-esoteric-break-glass-and-seek";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objCharacterPrinceSpino } from "../objects/characters/obj-character-prince-spino";
import { objEsotericOutOfOrderSign } from "../objects/esoteric/obj-esoteric-out-of-order-sign";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { RpgInventory } from "../rpg/rpg-inventory";
import { Search } from "../utils/search";

export function scnOhioHallParty() {
    const lvl = Lvl.OhioHallParty();
    enrichOutOfOrderSigns();
    enrichDoctorNpcs(lvl);
    enrichVendingMachines(lvl);

    objCharacterPrinceSpino()
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I'm very sick...",
                "Please help",
            );
        })
        .at(lvl.DemoMarker)
        .show();
}

function enrichVendingMachines(lvl: LvlType.OhioHallParty) {
    lvl.CyanMachine.mixin(mxnVendingMachine, "cyan");
    lvl.YellowMachine.mixin(mxnVendingMachine, "yellow");
    lvl.MagentaMachine.mixin(mxnVendingMachine, "magenta");
}

function enrichOutOfOrderSigns() {
    for (const signObj of Instances(objEsotericOutOfOrderSign)) {
        signObj
            .mixin(mxnEsotericBreakGlassAndSeek, [0, -16]);
    }
}

function enrichDoctorNpcs(lvl: LvlType.OhioHallParty) {
    const personaIds = [
        "OhioPartier0",
        "OhioPartier1",
        "OhioPartier2",
        "OhioPartier3",
        "OhioPartier4",
        "OhioPartier5",
    ] satisfies Array<DataNpcPersona.Id>;

    const correctPersonaId = Rng.item(personaIds);

    Rng.shuffle(
        Search.findMarkers(0x00ff00),
    )
        .map((position, i) =>
            objIguanaNpc(personaIds[i])
                .at(position)
                .add(0, 3)
                .zIndexed(ZIndex.CharacterEntities)
                .coro(function* (self) {
                    self.auto.setFacingImmediately(Rng.bool() ? 1 : -1);
                })
                .show()
        );

    objText.Large(DataNpcPersona.getById(correctPersonaId).name)
        .anchored(0.5, 0.5)
        .at(lvl.CorrectDoctorNameRegion)
        .add(lvl.CorrectDoctorNameRegion.width / 2, lvl.CorrectDoctorNameRegion.height / 2)
        .vround()
        .show();
}

function mxnVendingMachine(obj: DisplayObject, id: DataVendingMachine.Id) {
    const data = DataVendingMachine.manifest[id];
    const item: RpgInventory.Item.KeyItem = { kind: "key_item", id: data.keyItemId };

    const speakerObj = obj
        .mixin(mxnSpeaker, { name: data.name, tintSecondary: data.tint, tintPrimary: 0x727272 });
    return speakerObj
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("BZZZZZZRT... The prince needs medicine? What to do?", "Take", "Deposit");
            if (result === 1) {
                const count = yield* DramaInventory.removeAll(item);
                if (count === 0) {
                    yield* show("No compatible medicine detected.");
                }
                return;
            }

            yield* dramaShop(data.shopId, speakerObj.speaker);
        });
}

namespace DataVendingMachine {
    interface Model {
        name: string;
        keyItemId: DataKeyItem.Id;
        shopId: DataShop.Id;
        tint: RgbInt;
    }

    export const manifest = {
        cyan: {
            name: "Prince's Medicine Dispenser (Cyan)",
            keyItemId: "MedicineCyan",
            shopId: "OhioPartyMedicineCyan",
            tint: 0x00ffff,
        },
        yellow: {
            name: "Prince's Medicine Dispenser (Yellow)",
            keyItemId: "MedicineYellow",
            shopId: "OhioPartyMedicineYellow",
            tint: 0xffff00,
        },
        magenta: {
            name: "Prince's Medicine Dispenser (Magenta)",
            keyItemId: "MedicineMagenta",
            shopId: "OhioPartyMedicineMagenta",
            tint: 0xff00ff,
        },
    } satisfies Record<string, Model>;

    export type Id = keyof typeof manifest;
}
