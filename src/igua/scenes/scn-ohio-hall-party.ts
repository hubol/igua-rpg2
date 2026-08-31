import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { Rng } from "../../lib/math/rng";
import { ZIndex } from "../core/scene/z-index";
import { DataNpcPersona } from "../data/data-npc-persona";
import { show } from "../drama/show";
import { mxnEsotericBreakGlassAndSeek } from "../mixins/esoteric/mxn-esoteric-break-glass-and-seek";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCharacterPrinceSpino } from "../objects/characters/obj-character-prince-spino";
import { objEsotericOutOfOrderSign } from "../objects/esoteric/obj-esoteric-out-of-order-sign";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { Search } from "../utils/search";

export function scnOhioHallParty() {
    const lvl = Lvl.OhioHallParty();
    enrichOutOfOrderSigns();
    enrichDoctorNpcs(lvl);

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
