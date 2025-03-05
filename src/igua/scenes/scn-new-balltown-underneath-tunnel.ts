import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";

export function scnNewBalltownUnderneathTunnel() {
    Jukebox.play(Mzk.Covid19);
    const lvl = Lvl.NewBalltownUnderneathTunnel();
}
