import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DramaMisc } from "../drama/drama-misc";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";

export function scnStrangeMarketTowerInterior() {
    Jukebox.play(Mzk.BigLove);
    const lvl = Lvl.StrangeMarketTowerInterior();
    enrichMisterMonument(lvl);
}

function enrichMisterMonument(lvl: LvlType.StrangeMarketTowerInterior) {
    lvl.MisterMonument
        .mixin(mxnSpeaker, { name: "Holy Monument", colorPrimary: 0xB5B5B5, colorSecondary: 0x878787 })
        .mixin(mxnCutscene, function* () {
            yield* show("Monument to a noble sprite.");
            if (!(yield* ask("Worship?"))) {
                return;
            }

            playerObj.isBeingPiloted = true;
            playerObj.isDucking = true;

            yield sleep(1000);
            playerObj.sparklesPerFrame = 0.3;

            yield sleep(1000);
            playerObj.isDucking = false;
            playerObj.isBeingPiloted = false;

            yield sleep(1000);

            yield* DramaMisc.levitatePlayer(
                interpvr(playerObj).factor(factor.sine).to(lvl.PlayerDestinationMarker).over(4000),
            );

            playerObj.sparklesPerFrame = 0;
        });
}
