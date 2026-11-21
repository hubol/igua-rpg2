import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaCostco } from "../drama/drama-costco";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objEsotericHotDogCondimentDispenser } from "../objects/esoteric/obj-esoteric-hot-dog-condiment-dispenser";
import { playerObj } from "../objects/obj-player";

export function scnOhioCostco() {
    Jukebox.play(Mzk.DealsFantastico);
    const lvl = Lvl.OhioCostco();
    enrichGreeterNpc(lvl);
    enrichHotdoggerNpc(lvl);
}

function enrichGreeterNpc(lvl: LvlType.OhioCostco) {
    let isOpened = false;

    lvl.GreeterNpc
        .mixin(mxnCutscene, function* () {
            if (isOpened) {
                yield* show(
                    "Enjoy Costco Wholesale!!!",
                    "Eat a hot dog or summ'n!!!",
                );
                return;
            }

            isOpened = yield* DramaCostco.checkMembership();
        });

    lvl.GreeterBlock
        .coro(function* (self) {
            yield () => isOpened;
            let stepsCount = 0;
            const x = self.x;
            self.step(() => {
                self.x = Math.round(x + Math.sin(stepsCount++ / 15) * 10);
                self.y -= 1;
            });
        });
}

function enrichHotdoggerNpc(lvl: LvlType.OhioCostco) {
    lvl.HotdoggerNpc
        .mixin(mxnCutscene, function* () {
            yield () => playerObj.isOnGround;
            if (playerObj.y <= lvl.OnCounterMarker.y) {
                yield* show("Please get off the counter.");
                return;
            }

            yield* show("Hi.");
        });

    lvl.HotdogCounter
        .zIndexed(ZIndex.CharacterEntities + 1);

    objEsotericHotDogCondimentDispenser("ketchup")
        .at(lvl.KetchupMarker)
        .show();

    objEsotericHotDogCondimentDispenser("onion")
        .at(lvl.OnionMarker)
        .show();

    objEsotericHotDogCondimentDispenser("mustard")
        .at(lvl.MustardMarker)
        .show();
}
