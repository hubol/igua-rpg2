import { Integer } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { IguaClient } from "../net/igua-client";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "./obj-iguana-locomotive";
import { playerObj } from "./obj-player";

export function objNetRoom(client: IguaClient) {
    let lastTime = -1;
    const iguanaObjsById: Record<Integer, ObjIguanaLocomotive> = {};

    return container()
        .step(() => client.update(playerObj.x, playerObj.y, playerObj.ducking, playerObj.speed))
        .step(() => {
            if (!client.room) {
                return;
            }

            if (lastTime === client.room.time) {
                return;
            }

            for (const iguana of client.room.iguanas) {
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

            lastTime = client.room.time;
        });
}
