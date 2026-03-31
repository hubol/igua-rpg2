import { AlphaFilter, DisplayObject } from "pixi.js";
import { interp } from "../../lib/game-engine/routines/interp";
import { Integer } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { ZIndex } from "../core/scene/z-index";
import { DramaMisc } from "../drama/drama-misc";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { MxnSparkling, mxnSparkling } from "../mixins/mxn-sparkling";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { IguaClient } from "../net/igua-client";
import { SceneChanger } from "../systems/scene-changer";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "./obj-iguana-locomotive";
import { playerObj } from "./obj-player";

export function objNetRoom(client: IguaClient, offlineSceneChanger: SceneChanger) {
    let lastTime = Null<Integer>();
    const iguanaObjsById: Record<Integer, ObjIguanaLocomotive & MxnSparkling> = {};
    const iguanaIdsInRoom = new Set<Integer>();

    return container()
        .step(() => {
            if (scene.ticker.ticks % 2 === 0) {
                client.update(
                    playerObj.x,
                    playerObj.y,
                    playerObj.ducking,
                    playerObj.facing,
                    playerObj.speed,
                    playerObj.head.mouth.isSmoking,
                    playerObj.sparklesPerFrame > 0,
                );
            }
        })
        .step(() => {
            if (lastTime === client.room.time) {
                return;
            }

            iguanaIdsInRoom.clear();

            for (const iguana of client.room.iguanas) {
                iguanaIdsInRoom.add(iguana.id);
                if (!iguanaObjsById[iguana.id]) {
                    const newIguanaObj = objIguanaLocomotive(iguana.looks)
                        .mixin(mxnSparkling)
                        .zIndexed(ZIndex.CharacterEntities)
                        .show();
                    DramaMisc.arriveViaDoor(newIguanaObj);
                    newIguanaObj.auto.duckingSpeed = 0;
                    newIguanaObj.facing = iguana.facing;
                    iguanaObjsById[iguana.id] = newIguanaObj;
                }
                const iguanaObj = iguanaObjsById[iguana.id];

                const length = distance(iguanaObj, iguana);
                if (length > 64) {
                    iguanaObj.at(iguana);
                }
                else {
                    iguanaObj.moveTowards(iguana, length / 2).vround();
                }
                iguanaObj.speed.at(iguana.speed);
                iguanaObj.ducking = iguana.ducking;

                if (iguanaObj.speed.isZero && iguanaObj.facing === -iguana.facing) {
                    iguanaObj.facing = iguana.facing;
                }

                iguanaObj.head.mouth.isSmoking = Boolean(iguana.flags & (0b1));
                iguanaObj.sparklesPerFrame = Boolean(iguana.flags & (0b10)) ? 0.1 : 0;
            }

            for (const iguanaIdString in iguanaObjsById) {
                const iguanaId = Number(iguanaIdString);
                if (iguanaIdsInRoom.has(Number(iguanaId))) {
                    continue;
                }

                iguanaObjsById[iguanaId].mixin(mxnFxNetDie);
                delete iguanaObjsById[iguanaId];
            }

            lastTime = client.room.time;
        })
        .on("destroyed", () => client.close())
        .mixin(mxnSpeaker, { name: "Net God", tintPrimary: 0xff0000, tintSecondary: 0xffff00 })
        .coro(function* (self) {
            yield () => !client.isOnline;
            Cutscene.play(function* () {
                yield* show("You are being ejected.");
                offlineSceneChanger.changeScene();
            }, { speaker: self });
        });
}

function mxnFxNetDie(obj: DisplayObject) {
    const filter = new AlphaFilter(1);
    return obj
        .filtered(filter)
        .coro(function* () {
            yield interp(filter, "alpha").steps(4).to(0).over(500);
            obj.destroy();
        });
}
