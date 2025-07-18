import { Integer } from "../../lib/math/number-alias-types";
import { DataLib } from "./data-lib";

export namespace DataQuest {
    export type Complexity = "easy" | "normal";

    export interface Rewards {
        valuables: Integer;
        // TODO more stuff!
    }

    export interface Model {
        complexity: Complexity;
        rewards: Rewards;
    }

    export const Manifest = DataLib.createManifest(
        {
            NewBalltownArmorerReceivesFish: { complexity: "normal", rewards: { valuables: 160 } },
            NewBalltownFanaticDelivery: { complexity: "easy", rewards: { valuables: 50 } },
            NewBalltownUnderneathHomeownerEnemyPresenceCleared: { complexity: "easy", rewards: { valuables: 100 } },
            NewBalltownUnderneathMagicRisingFace: { complexity: "normal", rewards: { valuables: 100 } },
            __Fallback__: { complexity: "easy", rewards: { valuables: 0 } },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataQuest" });
}
