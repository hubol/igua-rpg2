import { Integer } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { IguaClient } from "../net/igua-client";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "./obj-iguana-locomotive";
import { playerObj } from "./obj-player";

export function objNetRoom(client: IguaClient) {
    const iguanaObjsById: Record<Integer, ObjIguanaLocomotive> = {};

    return container()
        .step(() => client.update(playerObj.x, playerObj.y, playerObj.ducking, playerObj.speed))
        .step(() => {
            for (const iguana of client.room.iguanas) {
                if (!iguanaObjsById[iguana.id]) {
                    iguanaObjsById[iguana.id] = objIguanaLocomotive(iguana.looks)
                        .zIndexed(ZIndex.CharacterEntities)
                        .show();
                }
                const iguanaObj = iguanaObjsById[iguana.id];
                const length = distance(iguanaObj, iguana);
                if (length > 64) {
                    iguanaObj.at(iguana);
                }
                else {
                    iguanaObj.moveTowards(iguana, length / 2);
                }
                iguanaObj.speed.at(iguana.speed);
                iguanaObj.ducking = iguana.ducking;
            }
        });
}
