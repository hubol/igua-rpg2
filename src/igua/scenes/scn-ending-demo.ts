import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { RpgAttack } from "../rpg/rpg-attack";

const atkSpikes = RpgAttack.create({
    physical: 25,
    emotional: 25,
});

export function scnEndingDemo() {
    Jukebox.play(Mzk.BestSeller);
    const lvl = Lvl.EndingDemo();
    lvl.SpikeRegion
        .mixin(mxnRpgAttack, { attack: atkSpikes });

    function killPlayer() {
        lvl.Door.objDoor.lock();
        lvl.Pipe
            .step(self => self.x -= 1);
    }

    // killPlayer();
}
