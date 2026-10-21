import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";
import { DataShop } from "./data-shop";

export namespace DataHomunculus {
    export interface Model {
        name: string;
        staffKeyItemId: DataKeyItem.Id;
        shopId: DataShop.Id;
    }

    export const { manifest, getById, ids } = DataLib.create(
        "DataHomunculus",
        {
            Flame: {
                name: "Homunculus of Flame",
                shopId: "HomunculusFlame",
                staffKeyItemId: "StaffFlame",
            },
            Earth: {
                name: "Homunculus of Earth",
                shopId: "HomunculusEarth",
                staffKeyItemId: "StaffEarth",
            },
            Forest: {
                name: "Homunculus of the Forest",
                shopId: "HomunculusForest",
                staffKeyItemId: "StaffForest",
            },
            Water: {
                name: "Homunculus of Water",
                shopId: "HomunculusWater",
                staffKeyItemId: "StaffWater",
            },
            Light: {
                name: "Homunculus of Light",
                shopId: "HomunculusLight",
                staffKeyItemId: "StaffLight",
            },
            Skies: {
                name: "Homunculus of the Skies",
                shopId: "HomunculusSkies",
                staffKeyItemId: "StaffSkies",
            },
            __Fallback__: {
                name: "Homunculus of Pie",
                shopId: "BalltownMechanicalIdol",
                staffKeyItemId: "BagOfSeeds",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
