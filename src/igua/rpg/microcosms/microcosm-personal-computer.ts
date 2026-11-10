import { DataKeyItem } from "../../data/data-key-item";
import { RpgInventory } from "../rpg-inventory";
import { RpgMicrocosm } from "../rpg-microcosm";

const softwareKeyItems = [
    { kind: "key_item", id: "SoftwareHighLow" },
] satisfies Array<RpgInventory.Item.KeyItem>;

export class MicrocosmPersonalComputer extends RpgMicrocosm<MicrocosmPersonalComputer.State> {
    constructor(private readonly _config: MicrocosmPersonalComputer.Config) {
        super();
    }

    get insertedSoftwareKeyItemId() {
        return this._state.softwareKeyItemId;
    }

    insert(id: MicrocosmPersonalComputer.SoftwareKeyItemId) {
        if (this.insertedSoftwareKeyItemId) {
            throw new Error("Cannot insert when software is already inserted");
        }

        this._state.softwareKeyItemId = id;
    }

    eject() {
        if (!this.insertedSoftwareKeyItemId) {
            throw new Error("Cannot eject when no software inserted");
        }

        const item: RpgInventory.Item.KeyItem = { kind: "key_item", id: this.insertedSoftwareKeyItemId };
        this._state.softwareKeyItemId = null;

        return item;
    }

    static readonly softwareKeyItems = softwareKeyItems;

    protected createState(): MicrocosmPersonalComputer.State {
        return {
            softwareKeyItemId: null,
        };
    }
}

export namespace MicrocosmPersonalComputer {
    export interface State {
        softwareKeyItemId: SoftwareKeyItemId | null;
    }

    export interface Config {
    }

    export type SoftwareKeyItemId = typeof softwareKeyItems[number]["id"];
}
