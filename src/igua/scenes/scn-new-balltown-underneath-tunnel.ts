import { LvlNewBalltownUnderneathTunnel, lvlNewBalltownUnderneathTunnel } from "../../assets/generated/levels/lvl-new-balltown-underneath-tunnel";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaMisc } from "../drama/drama-misc";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownUnderneathTunnel() {
    Jukebox.play(Mzk.Covid19);
    const lvl = lvlNewBalltownUnderneathTunnel();
    enrichTunneler(lvl);
}

function enrichTunneler(lvl: LvlNewBalltownUnderneathTunnel) {
    lvl.LeftDoor.locked = RpgProgress.flags.underneath.tunneler.isLeftDoorLocked;
    lvl.Tunneler.mixin(mxnCutscene, function* () {
        yield* show("Welcome. I'm the maintainer of this ancient tunnel.");
        const result = yield* ask(
            "Can I help you somehow?",
            RpgProgress.flags.underneath.tunneler.isLeftDoorLocked ? "Unlock the door" : null,
            "No, thanks",
        );

        if (result === 0) {
            yield* show("Oh, sure, sorry. I can totally unlock it for you...");
            yield DramaMisc.face(lvl.Tunneler, -1);
            yield* DramaMisc.walkToDoor.andUnlock(lvl.Tunneler, lvl.LeftDoor);
            RpgProgress.flags.underneath.tunneler.isLeftDoorLocked = false;
            yield DramaMisc.face(lvl.Tunneler, 1);
            yield* lvl.Tunneler.walkTo(lvl.Tunneler.startPosition.x);
            yield* show(
                "Sorry about that.",
                "I locked the door so that I could paint the tunnel in peace.",
                "Let me know if you need anything else.",
            );
        }
    });
}
