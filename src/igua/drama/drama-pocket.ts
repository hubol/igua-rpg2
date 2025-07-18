import { DisplayObject, Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { DataPocketItem } from "../data/data-pocket-item";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgPocket } from "../rpg/rpg-pocket";

const pocketTxs = Tx.Ui.Pocket.OpenablePocket.split({ count: 2 });

function objDramaPocket() {
    const spr = Sprite.from(pocketTxs[0])
        .anchored(0.5, 0.75)
        .mixin(mxnBoilPivot)
        .merge({
            drama: {
                destroy: function* () {
                    yield interpvr(spr).steps(4).translate(0, 64).over(500);
                    spr.destroy();
                },
            },
            methods: {
                open() {
                    // TODO sfx
                    spr.texture = pocketTxs[1];
                },
                close() {
                    // TODO sfx
                    spr.texture = pocketTxs[0];
                },
            },
        });

    return spr;
}

function* dramaCreatePocketObj() {
    const pocketObj = objDramaPocket().at(playerObj).scaled(0, 0).show();
    yield* Coro.all([
        interpvr(pocketObj).steps(4).translate(0, -64).over(500),
        interpv(pocketObj.scale).steps(4).to(1, 1).over(500),
    ]);
    return pocketObj;
}

function* empty(recipientObj: DisplayObject): Coro.Type<RpgPocket.EmptyResult> {
    const pocketObj = yield* dramaCreatePocketObj();
    pocketObj.methods.open();
    yield sleep(333);
    const result = RpgPocket.Methods.empty(Rpg.character.inventory.pocket);
    const pocketItemIds = Object.keys(result.items) as RpgPocket.Item[];

    const itemsObj = container().show();

    let delay = 15;

    for (const pocketItemId of pocketItemIds) {
        const count = result.items[pocketItemId];
        const tx = DataPocketItem.getById(pocketItemId).texture;
        for (let i = 0; i < count; i++) {
            // TODO sfx
            // TODO need more mature way to place object and recipient in appropriate spaces
            const itemObj = Sprite.from(tx).anchored(0.5, 0.5).scaled(0.5, 0.5).at(pocketObj).add(0, -8).coro(
                function* (self) {
                    yield* Coro.all([
                        interpv(self.scale).steps(3).to(1, 1).over(300),
                        interpvr(self).factor(factor.sine).translate(0, -32).over(300),
                    ]);
                    yield interpvr(self).factor(factor.sine).to(recipientObj).over(700);
                    self.destroy();
                },
            );
            itemsObj.addChildAt(itemObj, 0);
            delay -= 0.2;
            yield sleepf(Math.max(3, Math.ceil(delay)));
        }
    }
    yield sleep(300);
    pocketObj.methods.close();
    yield* pocketObj.drama.destroy();

    return result;
}

export const DramaPocket = {
    empty,
};
