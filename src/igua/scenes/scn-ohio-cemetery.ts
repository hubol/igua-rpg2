import { Container } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { Coro } from "../../lib/game-engine/routines/coro";
import { nlerp } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { DataPocketItem } from "../data/data-pocket-item";
import { DramaFacts } from "../drama/drama-facts";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgKill } from "../mixins/mxn-rpg-kill";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { objCharacterTheOwl } from "../objects/characters/obj-character-the-owl";
import { objCollectiblePocketItem } from "../objects/collectibles/obj-collectible-pocket-item";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { Search } from "../utils/search";

export function scnOhioCemetery() {
    const lvl = Lvl.OhioCemetery();
    lvl.WaterGroup
        .children
        .forEach(obj => obj.mixin(mxnSinePivot));

    lvl.PlayerKillRegion.mixin(mxnRpgKill);
    enrichEctoplasmActivity(0xff007a);
    enrichTheOwl(lvl);
}

function enrichTheOwl(lvl: LvlType.OhioCemetery) {
    const owlObj = objCharacterTheOwl();
    owlObj
        .mixin(mxnCutscene, function* () {
            if (Rpg.character.isRecentlyRevived) {
                yield* show(
                    "Welcome.",
                    "Your spirit chose this place to return to.",
                );
            }
            owlObj.objCharacterTheOwl.wingsRaised = true;
            const result = yield* ask(
                "Koo-weet! Koo-weet!\nWhat can I do for you?",
                "Trade",
                "About mausoleum",
                "About ectoplasm",
                "Nothing, sorry",
            );

            if (result === 0) {
                yield* dramaShop("TheOwl", owlObj.speaker);
                yield* show("Koo-weet! Koo-weet! See ya!");
            }
            else if (result === 1) {
                owlObj.objCharacterTheOwl.wingsRaised = false;
                yield* show(
                    "The mausoleum? Do you mean the Dungeon of Bones?",
                    "You'll find terrifying creatures there.",
                );

                yield* DramaFacts.memorize(
                    "DungeonBonesHistory",
                    "Famously, the ecotplasm-rich ground in our cemetery reanimates the dead.",
                );
                yield* show(
                    "Some say that tremendous rewards are at the bottom of the dungeon, but you'll need a means of escape.",
                );
            }
            else if (result === 2) {
                owlObj.objCharacterTheOwl.wingsRaised = false;
                yield* show(
                    "Ectoplasm is bountiful here.",
                    "You can collect it by playing around with the headstones and stuff.",
                    "It is generally not a useful resource, but it can be transformed into additional spirit experience on death.",
                );
            }
            else {
                yield* show("That's all right.");
            }

            owlObj.objCharacterTheOwl.wingsRaised = false;
        })
        .at(lvl.OwlMarker)
        .show();
}

function enrichEctoplasmActivity(regionTint: RgbInt) {
    const headstoneObjs = Search.findRegions(regionTint)
        .sort((a, b) => a.x - b.x)
        .map(mxnHeadstone);

    const maxIndex = headstoneObjs.length - 1;

    const pocketItemIds: DataPocketItem.Id[] = ["EctoplasmTypeA", "EctoplasmTypeB"];

    function getPreferredPocketItemId() {
        const hasOnePocketItemIds = pocketItemIds.filter(id => Rpg.inventory.pocket.has(id, 1));
        return hasOnePocketItemIds.length === 0
            ? Rng.item(pocketItemIds)
            : Rng.item(hasOnePocketItemIds);
    }

    interface SpawnData {
        id: DataPocketItem.Id;
        index: Integer;
        direction: Integer;
    }

    function getPocketItemSpawnData(index: Integer, direction: Integer): Array<SpawnData> {
        const preferredPocketItemId = getPreferredPocketItemId();

        if (index === 0) {
            return [{
                id: preferredPocketItemId,
                index: 1,
                direction: 1,
            }];
        }
        if (index === maxIndex) {
            return [{
                id: preferredPocketItemId,
                index: maxIndex - 1,
                direction: -1,
            }];
        }

        return pocketItemIds.map((id) => {
            const thisDirection = id === preferredPocketItemId ? direction : -direction;

            return ({
                id,
                index: index + thisDirection,
                direction: thisDirection,
            });
        });
    }

    function getSpawnPosition(index: Integer) {
        const headstoneObj = headstoneObjs[index];
        return vnew(headstoneObj.x + headstoneObj.width / 2, headstoneObj.y - 15).vround();
    }

    container()
        .coro(function* () {
            const maxEctoplasmsStreak = 5;
            let index = Rng.int(headstoneObjs.length);
            while (true) {
                const headstoneObj = headstoneObjs[index];
                headstoneObj.sparklesPerFrame = 0.3;
                yield () => headstoneObj.mxnHeadstone.isPlayerPerched;
                headstoneObj.sparklesPerFrame = 0;

                let direction = Rng.intp();

                for (let i = maxEctoplasmsStreak; i > 0; i--) {
                    Sfx.Interact.Cemetery.EctoplasmAppear.rate(nlerp(2, 1, (i - 1) / (maxEctoplasmsStreak - 1))).play();

                    const pocketItemObjs = getPocketItemSpawnData(index, direction)
                        .map(data =>
                            objCollectiblePocketItem.objGliding(data.id, getSpawnPosition(data.index))
                                .merge({ enrichEctoplasmActivity: { index: data.index, direction: data.direction } })
                                .at(getSpawnPosition(index))
                                .show()
                        );

                    const startTicks = scene.ticker.ticks;

                    yield* Coro.race(pocketItemObjs.map(obj => () => obj.destroyed));

                    const data = pocketItemObjs.find(obj => obj.destroyed)!.enrichEctoplasmActivity;
                    index = data.index;
                    direction = data.direction;

                    for (const obj of pocketItemObjs) {
                        if (!obj.destroyed) {
                            obj.destroy();
                        }
                    }

                    if (scene.ticker.ticks - startTicks > 75) {
                        const previousIndex = index;
                        while (index === previousIndex) {
                            index = Rng.int(headstoneObjs.length);
                        }

                        headstoneObjs[index].play(Sfx.Interact.Cemetery.PerformanceSlow, false);

                        break;
                    }
                    else if (i === 1) {
                        if (index === 0) {
                            index += 1;
                        }
                        else if (index === headstoneObjs.length - 1) {
                            index -= 1;
                        }
                        else {
                            index += Rng.intp();
                        }

                        headstoneObjs[index].play(Sfx.Interact.Cemetery.PerformanceOk);
                    }
                }
            }
        })
        .show();
}

const headstoneSparkleTints = [
    0xD1D9FF,
    0x47FFDA,
];

function mxnHeadstone(obj: Container) {
    const api = {
        get isPlayerPerched() {
            return playerObj.y < obj.y + obj.height && playerObj.isOnGround && playerObj.collides(obj);
        },
    };

    return obj
        .merge({ mxnHeadstone: api })
        .mixin(mxnSparkling)
        .step(self => self.sparklesTint = Rng.item(headstoneSparkleTints));
}
