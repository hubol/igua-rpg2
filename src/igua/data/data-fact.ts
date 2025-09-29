import { DataLib } from "./data-lib";

export namespace DataFact {
    export interface Model {
        messages: string[];
    }

    export const Manifest = DataLib.createManifest(
        {
            NewBalltownOlives: {
                messages: ["New Balltown olives are naturally salty from the mines."],
            },
            ZincLoads: {
                messages: ["Zinc is an element that makes your loads bigger."],
            },
            GeneratorFestivalAwesome: {
                messages: ["The Generator festival is a time when things are awesome."],
            },
            "__Fallback__": {
                messages: ["If you are reading this, it is a bug with the facts mechanic."],
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataFact" });
}
