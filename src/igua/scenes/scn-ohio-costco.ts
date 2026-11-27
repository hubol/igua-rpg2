import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { range } from "../../lib/range";
import { Check } from "../../lib/types/check";
import { Null } from "../../lib/types/null";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataShop } from "../data/data-shop";
import { DramaCostco } from "../drama/drama-costco";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaMisc } from "../drama/drama-misc";
import { dramaShop } from "../drama/drama-shop";
import { DramaWallet } from "../drama/drama-wallet";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objEsotericHotDogCondimentDispenser } from "../objects/esoteric/obj-esoteric-hot-dog-condiment-dispenser";
import { playerObj } from "../objects/obj-player";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnOhioCostco() {
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Invisible4px;
    Jukebox.play(Mzk.PenultimateRainbow);
    const lvl = Lvl.OhioCostco();
    enrichGreeterNpc(lvl);
    enrichHotdoggerNpc(lvl);
    enrichShelves(lvl);
}

function enrichShelves(lvl: LvlType.OhioCostco) {
    lvl.Shelf0.mixin(mxnCostcoShop, "OhioCostcoShelf0");
    lvl.Shelf1.mixin(mxnCostcoShop, "OhioCostcoShelf1");
    lvl.Shelf2.mixin(mxnCostcoShop, "OhioCostcoShelf2");
}

function mxnCostcoShop(obj: DisplayObject, shopId: DataShop.Id) {
    return obj
        .mixin(mxnCutscene, function* () {
            yield* dramaShop(shopId, {
                tintPrimary: 0xE61936,
                tintSecondary: 0x0060AB,
            });
        });
}

function enrichGreeterNpc(lvl: LvlType.OhioCostco) {
    let isOpened = false;

    lvl.GreeterNpc
        .mixin(mxnCutscene, function* () {
            if (isOpened) {
                yield* show(
                    "Enjoy Costco Wholesale!!!",
                    "Eat a hot dog or summ'n!!!",
                );
                return;
            }

            isOpened = yield* DramaCostco.checkMembership();
        });

    lvl.GreeterBlock
        .coro(function* (self) {
            yield () => isOpened;
            let stepsCount = 0;
            const x = self.x;
            self.step(() => {
                self.x = Math.round(x + Math.sin(stepsCount++ / 15) * 10);
                self.y -= 1;
            });
        });
}

const consts = {
    hotDogComboPriceValuables: Check<RpgEconomy.Offer>({ currency: "valuables", price: 5 }),
};

function enrichHotdoggerNpc(lvl: LvlType.OhioCostco) {
    lvl.HotdoggerNpc
        .mixin(mxnCutscene, function* () {
            yield () => playerObj.isOnGround && lvl.HotdoggerNpc.isOnGround;
            if (playerObj.y <= lvl.OnCounterMarker.y) {
                yield* show("Please get off the counter.");
                if (lvl.HotdoggerNpc.y <= lvl.OnCounterMarker.y) {
                    yield* show(
                        "Yes, I realize I am on the counter.",
                        "But I work here.",
                    );
                }
                return;
            }

            const result = yield* ask("Hi, can I help you?", "Buy combo", "Refill", "What is beef?", "No, thank you");

            if (result === 0) {
                const maxCombosCount = Math.floor(Rpg.inventory.potions.freeSlots / 2);
                const maxAffordableCombosCount = Math.min(
                    maxCombosCount,
                    Math.floor(Rpg.wallet.count("valuables") / consts.hotDogComboPriceValuables.price),
                );

                let disabledMessage = Null<string>();

                if (maxCombosCount <= 0) {
                    disabledMessage = "Not enough room for food";
                }
                else if (maxAffordableCombosCount <= 0) {
                    disabledMessage = "Can't afford";
                }

                const count = yield* DramaMisc.askNullableInteger(
                    `How many combos do you want?\nEach costs ${
                        RpgEconomy.Offer.toString(
                            consts.hotDogComboPriceValuables.price,
                            consts.hotDogComboPriceValuables.currency,
                        )
                    }.`,
                    {
                        max: maxAffordableCombosCount,
                        min: 1,
                        disabledMessage,
                        rejectMessage: "Nevermind",
                    },
                );

                if (count === null) {
                    yield* show("OK");
                    return;
                }

                // TODO should expose .spend or .spendCurrency
                yield* DramaWallet.spendValuables(consts.hotDogComboPriceValuables.price * count);

                const potionItems = range(count)
                    .flatMap(
                        (): RpgInventory.Item.Potion[] => [
                            { kind: "potion", id: "HotDog" },
                            // TODO soda
                            { kind: "potion", id: "Wetness" },
                        ],
                    );

                yield* DramaInventory.receiveItems(potionItems);
            }
        });

    lvl.HotdogCounter
        .zIndexed(ZIndex.CharacterEntities + 1);

    objEsotericHotDogCondimentDispenser("ketchup")
        .at(lvl.KetchupMarker)
        .show();

    objEsotericHotDogCondimentDispenser("onion")
        .at(lvl.OnionMarker)
        .show();

    objEsotericHotDogCondimentDispenser("mustard")
        .at(lvl.MustardMarker)
        .show();
}
