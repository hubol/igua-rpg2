import { Container } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Coro } from "../../lib/game-engine/routines/coro";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { DataPocketItem } from "../data/data-pocket-item";
import { scene } from "../globals";
import { mxnRpgKill } from "../mixins/mxn-rpg-kill";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSparkling } from "../mixins/mxn-sparkling";
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
    }

    function getPocketItemSpawnData(index: Integer): Array<SpawnData> {
        if (index === 0) {
            return [{
                id: getPreferredPocketItemId(),
                index: 1,
            }];
        }
        if (index === maxIndex) {
            return [{
                id: getPreferredPocketItemId(),
                index: maxIndex - 1,
            }];
        }
        return Rng.shuffle([...pocketItemIds]).map((id, offset) => ({ id, index: index + (offset === 0 ? -1 : 1) }));
    }

    function getSpawnPosition(index: Integer) {
        const headstoneObj = headstoneObjs[index];
        return vnew(headstoneObj.x + headstoneObj.width / 2, headstoneObj.y - 15).vround();
    }

    container()
        .coro(function* () {
            let index = Rng.int(headstoneObjs.length);
            while (true) {
                const headstoneObj = headstoneObjs[index];
                headstoneObj.sparklesPerFrame = 0.3;
                yield () => headstoneObj.mxnHeadstone.isPlayerPerched;
                headstoneObj.sparklesPerFrame = 0;

                for (let i = 0; i < 5; i++) {
                    const pocketItemObjs = getPocketItemSpawnData(index)
                        .map(data =>
                            objCollectiblePocketItem.objGliding(data.id, getSpawnPosition(data.index))
                                .merge({ enrichEctoplasmActivity: { index: data.index } })
                                .at(getSpawnPosition(index))
                                .show()
                        );

                    const startTicks = scene.ticker.ticks;

                    yield* Coro.race(pocketItemObjs.map(obj => () => obj.destroyed));

                    index = pocketItemObjs.find(obj => obj.destroyed)!.enrichEctoplasmActivity.index;

                    for (const obj of pocketItemObjs) {
                        if (!obj.destroyed) {
                            obj.destroy();
                        }
                    }

                    if (scene.ticker.ticks - startTicks > 75) {
                        break;
                    }
                }

                if (index === 0) {
                    index += 1;
                }
                else if (index === headstoneObjs.length - 1) {
                    index -= 1;
                }
                else {
                    index += Rng.intp();
                }
            }
        })
        .show();
}

function mxnHeadstone(obj: Container) {
    const api = {
        get isPlayerPerched() {
            return playerObj.y < obj.y + obj.height && playerObj.isOnGround && playerObj.collides(obj);
        },
    };

    return obj
        .merge({ mxnHeadstone: api })
        .mixin(mxnSparkling);
}
