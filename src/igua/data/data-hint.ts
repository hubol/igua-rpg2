import { DataLib } from "./data-lib";
import { DataQuest } from "./data-quest";
import { DataShop } from "./data-shop";

export namespace DataHint {
    namespace Model {
        export interface Base {
            messages: string[];
        }

        export interface Shop {
            kind: "shop";
            shopId: DataShop.Id;
        }

        export interface Quest {
            kind: "quest";
            questId: DataQuest.Id;
        }
    }

    // export const {} = DataLib.create("DataHint", {});
}
