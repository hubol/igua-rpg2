import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";
import { DataShop } from "./data-shop";
import { DataTemporaryEffect } from "./data-temporary-effect";

export namespace DataHomunculus {
    export interface Model {
        name: string;
        staffKeyItemId: DataKeyItem.Id;
        shopId: DataShop.Id;
        temporaryEffectId: DataTemporaryEffect.Id;
    }

    export const { manifest, getById, ids } = DataLib.create(
        "DataHomunculus",
        {
            Flame: {
                name: "Homunculus of Flame",
                shopId: "HomunculusFlame",
                staffKeyItemId: "StaffFlame",
                temporaryEffectId: "HomunculusFlame",
            },
            Earth: {
                name: "Homunculus of Earth",
                shopId: "HomunculusEarth",
                staffKeyItemId: "StaffEarth",
                temporaryEffectId: "HomunculusEarth",
            },
            Forest: {
                name: "Homunculus of the Forest",
                shopId: "HomunculusForest",
                staffKeyItemId: "StaffForest",
                temporaryEffectId: "HomunculusForest",
            },
            Water: {
                name: "Homunculus of Water",
                shopId: "HomunculusWater",
                staffKeyItemId: "StaffWater",
                temporaryEffectId: "HomunculusWater",
            },
            Light: {
                name: "Homunculus of Light",
                shopId: "HomunculusLight",
                staffKeyItemId: "StaffLight",
                temporaryEffectId: "HomunculusLight",
            },
            Skies: {
                name: "Homunculus of the Skies",
                shopId: "HomunculusSkies",
                staffKeyItemId: "StaffSkies",
                temporaryEffectId: "HomunculusSkies",
            },
            __Fallback__: {
                name: "Homunculus of Pie",
                shopId: "BalltownMechanicalIdol",
                staffKeyItemId: "BagOfSeeds",
                temporaryEffectId: "HomunculusEarth",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
