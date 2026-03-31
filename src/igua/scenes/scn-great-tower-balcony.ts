import { Container } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnInteract } from "../mixins/mxn-interact";
import { mxnInteractOnlyWhenPlayerIsOnGround } from "../mixins/mxn-interact-only-when-player-is-on-ground";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Rpg } from "../rpg/rpg";
import { RpgProgressData } from "../rpg/rpg-progress";

export function scnGreatTowerBalcony() {
    Jukebox.play(Mzk.UnforgivableToner);
    const lvl = Lvl.GreatTowerBalcony();
    enrichEfficientHome(lvl);
    enrichFisherman(lvl);
}

interface LeverBitfieldConfiguration {
    checkpointName: string;
}

const leverBitfieldConfigurations: Array<LeverBitfieldConfiguration> = [
    { checkpointName: "fromEfficient0" },
    { checkpointName: "fromEfficient1" },
    { checkpointName: "fromEfficient2" },
    { checkpointName: "fromEfficient3" },
    { checkpointName: "fromEfficient4" },
    { checkpointName: "fromEfficient5" },
    { checkpointName: "fromEfficient6" },
    { checkpointName: "fromEfficient7" },
];

function getLeverBitfield() {
    let value = 0;

    const { lever0, lever1, lever2 } = Rpg.flags.greatTower.balcony;

    if (lever0) {
        value |= 0b100;
    }
    if (lever1) {
        value |= 0b010;
    }
    if (lever2) {
        value |= 0b001;
    }

    return value;
}

function enrichEfficientHome(lvl: LvlType.GreatTowerBalcony) {
    lvl.Lever0.mixin(mxnLever, "lever0");
    lvl.Lever1.mixin(mxnLever, "lever1");
    lvl.Lever2.mixin(mxnLever, "lever2");

    lvl.Door.step(self => {
        const field = getLeverBitfield();
        const config = leverBitfieldConfigurations[field] ?? leverBitfieldConfigurations[0];
        self.objDoor.checkpointName = config.checkpointName;
    });
}

function mxnLever(obj: Container, key: keyof RpgProgressData["flags"]["greatTower"]["balcony"]) {
    return obj
        .mixin(mxnInteract, () => Rpg.flags.greatTower.balcony[key] = !Rpg.flags.greatTower.balcony[key])
        .step(self => self.flipV(Rpg.flags.greatTower.balcony[key] ? 1 : -1));
}

function enrichFisherman(lvl: LvlType.GreatTowerBalcony) {
    lvl.FishermanRegion
        .mixin(mxnSpeaker, { name: "Good Joe", tintPrimary: 0xAA71DB, tintSecondary: 0xFF7F00 })
        .mixin(mxnCutscene, function* () {
            yield* show("Oh hey...");
            const result = yield* ask("Can you pretend to be a fish for me?", "Glub", "I refuse");
            if (result === 0) {
                yield* show("Good impression. Nice.");
                if (yield* DramaQuests.complete("GreatTower.Balcony.Fisherman.Appeased")) {
                    yield* show("I found this stinky little key. Maybe you'll enjoy it, fishy!");
                }
            }
            else {
                yield* show("Hm... not a good impression.");
            }
        })
        .mixin(mxnInteractOnlyWhenPlayerIsOnGround);
}
