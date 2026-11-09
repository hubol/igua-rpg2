import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objEsotericBoneChest } from "../objects/esoteric/obj-esoteric-bone-chest";

export function scnDungeonBonesDeeper() {
    Jukebox.play(Mzk.UndergroundRucksack);
    const lvl = Lvl.DungeonBonesDeeper();
    enrichExplorerNpc(lvl);
}

function enrichExplorerNpc(lvl: LvlType.DungeonBonesDeeper) {
    let failedChest = false;

    Instances(objEsotericBoneChest)
        .forEach(obj => obj.handles("objEsotericBoneChest.fail", () => failedChest = true));

    lvl.ExplorerNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I'm the professor leading the exploration into the dungeon.",
            );

            const result = yield* ask(
                "I'm holding a fundraiser to continue my research, so I have some stuff to trade. Or maybe you need something else...?",
                "Trade",
                "Advice",
                "Nothing",
            );

            if (result === 0) {
                yield* dramaShop("DungeonExplorer", lvl.ExplorerNpc.speaker);
            }
            else if (result === 1) {
                yield* show(
                    "I barely got back to this point in the dungeon...",
                    "There are pretty intense traps being operated by reanimated skeletons.",
                    "Awkward!!!",
                );
            }
            else {
                yield* show("Ok! I'll be here.");
            }
        })
        .coro(function* (self) {
            yield () => failedChest;
            Cutscene.play(function* () {
                self.auto.facing = 1;
                yield sleep(500);
                yield* show("Yeah... I don't know anything about those chests.");
            }, { speaker: self });
        });
}
