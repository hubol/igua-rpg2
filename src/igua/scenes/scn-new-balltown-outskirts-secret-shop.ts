import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgShop } from "../rpg/rpg-shop";

const newBalltownSecretRpgShop = new RpgShop({
    internalName: "newBalltownSecretShop",
    stocks: [
        {
            product: { kind: "equipment", name: "JumpAtSpecialSignsRing" },
            initialQuantity: 999,
            price: {
                currency: { kind: "experience", experience: "jump" },
                initial: 1,
                deltaSold: 3,
            },
        },
        {
            product: { kind: "equipment", name: "PoisonRing" },
            initialQuantity: 999,
            price: {
                currency: "valuables",
                initial: 1,
                deltaSold: 3,
            },
        },
        {
            product: { kind: "equipment", name: "RichesRing" },
            initialQuantity: 999,
            price: {
                currency: "valuables",
                initial: 1,
                deltaSold: 3,
            },
        },
        {
            product: { kind: "equipment", name: "JumpAtSpecialSignsRing" },
            initialQuantity: 3,
            price: {
                currency: { kind: "experience", experience: "combat" },
                initial: 100,
                deltaSold: 200,
            },
        },
        {
            product: { kind: "equipment", name: "JumpAtSpecialSignsRing" },
            initialQuantity: 3,
            price: {
                currency: "valuables",
                initial: 100,
                deltaSold: 200,
            },
        },
        {
            product: { kind: "equipment", name: "JumpAtSpecialSignsRing" },
            initialQuantity: 3,
            price: {
                currency: { kind: "experience", experience: "computer" },
                initial: 100,
                deltaSold: 200,
            },
        },
        {
            product: { kind: "equipment", name: "JumpAtSpecialSignsRing" },
            initialQuantity: 3,
            price: {
                currency: { kind: "experience", experience: "gambling" },
                initial: 100,
                deltaSold: 200,
            },
        },
        {
            product: { kind: "equipment", name: "JumpAtSpecialSignsRing" },
            initialQuantity: 3,
            price: {
                currency: { kind: "experience", experience: "pocket" },
                initial: 100,
                deltaSold: 200,
            },
        },
    ],
});

export function scnNewBalltownOutskirtsSecretShop() {
    Jukebox.play(Mzk.OpenWound);
    const lvl = Lvl.NewBalltownOutskirtsSecretShop();

    lvl.Shopkeeper.mixin(mxnCutscene, function* () {
        yield* dramaShop(newBalltownSecretRpgShop, { primaryTint: 0x152F12, secondaryTint: 0xE6E8CC });
    });
}
