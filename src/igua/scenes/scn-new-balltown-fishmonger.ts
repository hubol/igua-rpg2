import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaMisc } from "../drama/drama-misc";
import { ask, show } from "../drama/show";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";
import { objFish } from "../objects/obj-fish";
import { Rpg } from "../rpg/rpg";

export function scnNewBalltownFishmonger() {
    Jukebox.play(Mzk.BreadCrumbPool);
    const lvl = Lvl.NewBalltownFishmonger();
    enrichFishmonger(lvl);
}

function enrichAquarium(lvl: LvlType.NewBalltownFishmonger) {
    const fishObjs = [
        objFish.forArmorer().at(lvl.Fish0).show(),
        objFish.forRinger().at(lvl.Fish1).show(),
        ...[lvl.Fish2].map(markerObj =>
            objFish(markerObj.x * 9999 + markerObj.y * 8888 + 800_903).at(markerObj).show()
        ),
    ];

    lvl.WaterLineTop.mixin(mxnBoilPivot);
    return {
        fishObjs,
    };
}

function enrichFishmonger(lvl: LvlType.NewBalltownFishmonger) {
    const { fishObjs } = enrichAquarium(lvl);
    const { deliveries } = Rpg.flags.newBalltown.fishmonger;

    if (deliveries.armorer) {
        fishObjs[0].destroy();
    }

    if (deliveries.ringer) {
        fishObjs[1].destroy();
    }

    if (deliveries.armorer && deliveries.armorer !== "delivered") {
        lvl.Fishmonger.destroy();
        return;
    }

    lvl.Fishmonger.mixin(mxnCutscene, function* () {
        yield* show("Hello! I deal in fish.");
        const result = yield* ask("Can I help you somehow?", "Favorite fish aspect", "Fish delivery", "No");
        if (result === 0) {
            yield* show(
                "Fish are very entertaining to watch.",
                "I feel bad that I have trapped them in a jail cell. But boy are they cute!",
                "I want to share my fish with the world!",
            );
        }
        else if (result === 1) {
            const fishRecipient = yield* ask(
                "You want a fish delivered? That's great! Who wants a fish?",
                Rpg.flags.newBalltown.armorer.toldPlayerAboutDesireForFish
                    && !deliveries.armorer
                    ? DataNpcPersona.Manifest.NewBalltownArmorer.name
                    : null,
                Rpg.flags.greatTower.efficientHome.ringer.toldPlayerAboutDesireForFish
                    && !deliveries.ringer
                    ? DataNpcPersona.Manifest.CloudHouseRinger.name
                    : null,
                "I don't know",
            );

            if (fishRecipient === 2) {
                yield* show("Oh, okay. Let me know if you find an interested party!");
                return;
            }

            if (fishRecipient === 1) {
                yield* show(
                    `${DataNpcPersona.Manifest.CloudHouseRinger.name} in the cloud house apartment?`,
                    "He's a bit unusual... Maybe a fish could improve him.",
                );

                yield* dramaTakeFish(fishObjs[1]);

                yield* DramaInventory.receiveItems([{ kind: "key_item", id: "RingerFish" }]);
                deliveries.ringer = "handed_off_to_player";

                yield* show(
                    "It's kind of a long walk...",
                    "And I don't have any ballons.",
                    "Why don't you make the delivery yourself?",
                );
            }

            if (fishRecipient === 0) {
                yield* show(
                    `${DataNpcPersona.Manifest.NewBalltownArmorer.name}...? Oh yeah, he had a fishtank!`,
                    "Since he's in town, let's deliver the fish together!",
                );
                if (yield* ask("Ready to make the delivery with me?")) {
                    yield* show("Great!");
                    yield* dramaTakeFish(fishObjs[0]);
                    yield* show("See you outside!");
                    yield* lvl.Fishmonger.walkTo(lvl.Door.x + 30);
                    DramaMisc.departRoomViaDoor(lvl.Fishmonger);
                    Rpg.flags.newBalltown.fishmonger.deliveries.armorer = "ready";
                }
                else {
                    yield* show("Okay, let me know when you are ready!");
                }
            }
        }
        else if (result === 2) {
            yield* show("Okay! See you around!");
        }
    });
}
function* dramaTakeFish(obj: DisplayObject) {
    yield sleep(500);
    Sfx.Cutscene.FishTake.play();
    objFxBurst32().at(obj).show();
    obj.destroy();
    yield sleep(500);
}
