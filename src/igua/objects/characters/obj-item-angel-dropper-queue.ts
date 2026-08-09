import { DisplayObject } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { RpgInventory } from "../../rpg/rpg-inventory";
import { objItemAngelDropper } from "./obj-item-angel-dropper";

interface Request {
    obj: DisplayObject;
    item: RpgInventory.Item;
}

export function objItemAngelDropperQueue() {
    const requests = new Array<Request>();
    let requestsStartedCount = 0;

    const api = {
        push(obj: DisplayObject, item: RpgInventory.Item) {
            requests.push({ obj, item });
        },
    };

    return container()
        .merge({ objItemAngelDropperQueue: api })
        .coro(function* () {
            while (true) {
                yield () => requests.length > 0;
                const request = requests.shift()!;

                if (request.obj.destroyed) {
                    continue;
                }

                requestsStartedCount++;

                objItemAngelDropper(request.obj, request.item)
                    .at(scene.camera)
                    .add(requestsStartedCount % 2 === 0 ? -100 : 510, 100)
                    .vround()
                    .show();

                yield () => !objItemAngelDropper.areAnyTargeting(request.obj);
            }
        });
}
