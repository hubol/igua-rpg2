import { DataLib } from "./data-lib";

export namespace DataFact {
    export interface Model {
        heading: string;
        messages: string[];
    }

    export const Manifest = DataLib.createManifest(
        {
            NewBalltownOlives: {
                heading: "About New Balltown Olives",
                messages: ["New Balltown olives are naturally salty from the mines."],
            },
            ZincLoads: {
                heading: "About Zinc",
                messages: ["Zinc is an element that makes your loads bigger."],
            },
            GeneratorFestivalAwesome: {
                heading: "About Generator festival",
                messages: ["The Generator festival is a time when things are awesome."],
            },
            FarmingGods: {
                heading: "About farming gods",
                messages: ["Beet and Wheat are farming gods created by the Wizard of Emotion."],
            },
            Poison: {
                heading: "About poison",
                messages: ["Poison is not fatal. Also, it increases your running speed and bounciness."],
            },
            "__Fallback__": {
                heading: "About a bug",
                messages: ["If you are reading this, it is a bug with the facts mechanic."],
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataFact" });
}
