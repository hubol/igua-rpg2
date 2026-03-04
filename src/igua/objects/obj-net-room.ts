import { AlphaFilter, DisplayObject } from "pixi.js";
import { interp } from "../../lib/game-engine/routines/interp";
import { Integer } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { scene } from "../globals";
import { IguaClient } from "../net/igua-client";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "./obj-iguana-locomotive";
import { playerObj } from "./obj-player";

export function objNetRoom(client: IguaClient) {
    let lastTime = -1;
    const iguanaObjsById: Record<Integer, ObjIguanaLocomotive> = {};
    const iguanaIdsInRoom = new Set<Integer>();

    return container()
        .step(() => {
            if (scene.ticker.ticks % 2 === 0) {
                client.update(playerObj.x, playerObj.y, playerObj.ducking, playerObj.speed);
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
                        .zIndexed(ZIndex.CharacterEntities)
                        .show();
                    newIguanaObj.auto.duckingSpeed = 0;
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
