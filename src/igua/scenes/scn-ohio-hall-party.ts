import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { ZIndex } from "../core/scene/z-index";
import { DataNpcPersona } from "../data/data-npc-persona";
import { objCharacterKingSpino } from "../objects/characters/obj-character-king-spino";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { playerObj } from "../objects/obj-player";
import { StepOrder } from "../objects/step-order";
import { Search } from "../utils/search";

export function scnOhioHallParty() {
    const lvl = Lvl.OhioHallParty();
    enrichOutOfOrderSign(lvl);
    enrichDoctorNpcs();
    // objCharacterKingSpino()
    //     .at(lvl.DemoMarker)
    //     .show();
}

function enrichOutOfOrderSign(lvl: LvlType.OhioHallParty) {
    const position = vnew();
    lvl.OutOfOrderSign
        .step(self => {
            position.at(playerObj).add(0, -16);
            self.moveTowards(position, 2);
        }, StepOrder.AfterPhysics)
        .zIndexed(ZIndex.FrontDecals);
}

function enrichDoctorNpcs() {
    const personaIds = [
        "OhioPartierBestDoctor",
        "OhioPartier0",
        "OhioPartier1",
        "OhioPartier2",
        "OhioPartier3",
        "OhioPartier4",
    ] satisfies Array<DataNpcPersona.Id>;

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
}
