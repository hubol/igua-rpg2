import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { Cutscene, scene } from "../globals";
import { objFxFormativeBurst } from "../objects/effects/obj-fx-formative-burst";
import { objAngelSnow } from "../objects/enemies/obj-angel-snow";
import { objEsotericHotPineConeTree } from "../objects/esoteric/obj-esoteric-hot-pine-cone-tree";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallSnowman() {
    Jukebox.play(Mzk.SodaMachine);
    const lvl = Lvl.IndianaHallSnowman();

    const treeObjs = [lvl.TreeMarker0, lvl.TreeMarker1]
        .map(marker => objEsotericHotPineConeTree().at(marker).show());

    treeObjs[0].objEsotericHotPineConeTree.gainPineCone();

    let releasedPineCone = false;
    treeObjs[0].handles("objEsotericHotPineConeTree.coneReleased", () => releasedPineCone = true);

    scene.stage
        .coro(function* () {
            yield () => releasedPineCone;
            yield sleep(1000);
            objFxFormativeBurst(0xA286F3)
                .at(lvl.SnowAngelMarker)
                .show();
            yield sleep(1000);
            const snowAngelObj = objAngelSnow().at(lvl.SnowAngelMarker).show();
            objBossMusicPlayer({
                bossObjs: [snowAngelObj],
                mzkBattle: Mzk.FuckerLand,
                mzkPeace: Mzk.SodaMachine,
            })
                .show();
            while (!snowAngelObj.destroyed) {
                yield sleep(4000);
                Rng.item(treeObjs).objEsotericHotPineConeTree.gainPineCone();
            }

            Cutscene.play(function* () {
                yield* DramaHallOfDoors.complete(Rpg.microcosms["Indiana.HallOfDoors"], 0);
            });
        });
}
