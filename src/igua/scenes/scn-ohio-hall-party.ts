import { DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { ZIndex } from "../core/scene/z-index";
import { DataKeyItem } from "../data/data-key-item";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DataShop } from "../data/data-shop";
import { DramaInventory } from "../drama/drama-inventory";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnEsotericBreakGlassAndSeek } from "../mixins/esoteric/mxn-esoteric-break-glass-and-seek";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objCharacterPrinceSpino } from "../objects/characters/obj-character-prince-spino";
import { objEsotericOutOfOrderSign } from "../objects/esoteric/obj-esoteric-out-of-order-sign";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { RpgInventory } from "../rpg/rpg-inventory";
import { Search } from "../utils/search";

export function scnOhioHallParty() {
    const lvl = Lvl.OhioHallParty();
    const state: HallPartyState = { awareOfPrinceIllness: false };
    enrichOutOfOrderSigns();
    enrichDoctorNpcs(lvl, state);
    enrichVendingMachines(lvl);

    objCharacterPrinceSpino()
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I ate too much cake...",
                "My tummy hurts so bad.",
                "Please talk with the doctors to find out what to do.",
            );
            state.awareOfPrinceIllness = true;
        })
        .at(lvl.DemoMarker)
        .show();
}

interface HallPartyState {
    awareOfPrinceIllness: boolean;
}

function enrichVendingMachines(lvl: LvlType.OhioHallParty) {
    lvl.CyanMachine.mixin(mxnVendingMachine, "cyan");
    lvl.YellowMachine.mixin(mxnVendingMachine, "yellow");
    lvl.MagentaMachine.mixin(mxnVendingMachine, "magenta");
}

function enrichOutOfOrderSigns() {
    for (const signObj of Instances(objEsotericOutOfOrderSign)) {
        signObj
            .mixin(mxnEsotericBreakGlassAndSeek, [0, -16]);
    }
}

function enrichDoctorNpcs(
    lvl: LvlType.OhioHallParty,
    state: HallPartyState,
): { correctCocktail: HallMedicineCocktail.Model } {
    const personaIds = [
        "OhioPartier0",
        "OhioPartier1",
        "OhioPartier2",
        "OhioPartier3",
        "OhioPartier4",
        "OhioPartier5",
    ] satisfies Array<DataNpcPersona.Id>;

    const cocktails = HallMedicineCocktail.generateUniqueList(personaIds.length);

    const data = personaIds
        .map((personaId, i) => ({
            personaId,
            cocktail: cocktails[i],
        }));

    const correctData = Rng.item(data);

    Rng.shuffle(
        Search.findMarkers(0x00ff00),
    )
        .map((position, i) => {
            const greetingMessage = Rng.choose("Some party, huh?!", "What a wild party!", "I love party.");
            const isDoctorMessage = Rng.choose("Yes.");
            const isSickMessage = Rng.choose("He is?! What's wrong?", "Oh no! What are his symptoms?");
            const confidentMessage = Rng.choose(
                "I see, this should be easy enough.",
                "Oh, I've seen this a million times.",
                "Oh, this happens all the time.",
            );

            const thisData = data[i];

            objIguanaNpc(thisData.personaId)
                .at(position)
                .add(0, 3)
                .zIndexed(ZIndex.CharacterEntities)
                .coro(function* (self) {
                    self.auto.setFacingImmediately(Rng.bool() ? 1 : -1);
                })
                .mixin(mxnCutscene, function* () {
                    if (!state.awareOfPrinceIllness) {
                        yield* show(greetingMessage);
                        return;
                    }

                    const result = yield* ask(greetingMessage, "Are you a doctor?", "The prince is sick!");
                    if (result === 0) {
                        yield* show(isDoctorMessage);
                    }
                    else if (result === 1) {
                        yield* ask(isSickMessage, "His tummy is hurting");
                        yield* show(confidentMessage);
                        yield* show(
                            "To cure the prince, you just need to feed him a cocktail of medicine as follows:",
                            HallMedicineCocktail.print(thisData.cocktail),
                            "You need to feed it to him all at once.",
                        );
                    }
                })
                .show();
        });

    objText.Large(DataNpcPersona.getById(correctData.personaId).name)
        .anchored(0.5, 0.5)
        .at(lvl.CorrectDoctorNameRegion)
        .add(lvl.CorrectDoctorNameRegion.width / 2, lvl.CorrectDoctorNameRegion.height / 2)
        .vround()
        .show();

    return {
        correctCocktail: correctData.cocktail,
    };
}

function mxnVendingMachine(obj: DisplayObject, id: DataVendingMachine.Id) {
    const data = DataVendingMachine.manifest[id];
    const item: RpgInventory.Item.KeyItem = { kind: "key_item", id: data.keyItemId };

    const speakerObj = obj
        .mixin(mxnSpeaker, { name: data.name, tintSecondary: data.tint, tintPrimary: 0x727272 });
    return speakerObj
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("AUTHORIZED PERSONNEL ONLY\n\nPlease make your selection.", "Take", "Deposit");
            if (result === 1) {
                const count = yield* DramaInventory.removeAll(item);
                if (count === 0) {
                    yield* show("No compatible medicine detected.");
                }
                return;
            }

            yield* dramaShop(data.shopId, speakerObj.speaker);
        });
}

namespace DataVendingMachine {
    interface Model {
        name: string;
        keyItemId: DataKeyItem.Id;
        shopId: DataShop.Id;
        tint: RgbInt;
    }

    export const manifest = {
        cyan: {
            name: "Prince's Medicine Dispenser (Cyan)",
            keyItemId: "MedicineCyan",
            shopId: "OhioPartyMedicineCyan",
            tint: 0x00ffff,
        },
        yellow: {
            name: "Prince's Medicine Dispenser (Yellow)",
            keyItemId: "MedicineYellow",
            shopId: "OhioPartyMedicineYellow",
            tint: 0xffff00,
        },
        magenta: {
            name: "Prince's Medicine Dispenser (Magenta)",
            keyItemId: "MedicineMagenta",
            shopId: "OhioPartyMedicineMagenta",
            tint: 0xff00ff,
        },
    } satisfies Record<string, Model>;

    export type Id = keyof typeof manifest;
}

namespace HallMedicineCocktail {
    export interface Model {
        cyan: Integer;
        yellow: Integer;
        magenta: Integer;
    }

    export function generateUniqueList(count: Integer) {
        const usedKeys = new Set<string>();
        const result = new Array<Model>();

        while (result.length < count) {
            const model: Model = {
                cyan: Rng.int(6),
                magenta: Rng.int(6),
                yellow: Rng.int(6),
            };

            if (model.cyan === 0 && model.magenta === 0 && model.yellow === 0) {
                continue;
            }

            const key = getKey(model);

            if (usedKeys.has(key)) {
                continue;
            }

            usedKeys.add(key);
            result.push(model);
        }

        return result;
    }

    export function print(model: Model) {
        return (["cyan", "yellow", "magenta"] as const)
            .flatMap(key => model[key] === 0 ? [] : [`${model[key]}x ${key} tablet`])
            .join("\n");
    }

    function getKey(model: Model) {
        return `${model.cyan}_${model.magenta}_${model.yellow}`;
    }
}
