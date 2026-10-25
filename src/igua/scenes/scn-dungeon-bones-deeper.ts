import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnDungeonBonesDeeper() {
    Jukebox.play(Mzk.UndergroundRucksack);
    const lvl = Lvl.DungeonBonesDeeper();
    enrichExplorerNpc(lvl);
}

function enrichExplorerNpc(lvl: LvlType.DungeonBonesDeeper) {
    lvl.ExplorerNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I'm the professor leading the exploration into the dungeon.",
            );

            const result = yield* ask(
                "I'm seeking funding, so I have some stuff to trade. Or maybe you need something else...?",
                "Trade",
                "Nothing",
            );

            if (result === 0) {
                yield* dramaShop("DungeonExplorer", lvl.ExplorerNpc.speaker);
            }
            else {
                yield* show("Ok! I'll be here.");
            }
        });
}
