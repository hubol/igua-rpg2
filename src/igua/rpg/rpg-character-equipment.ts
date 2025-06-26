import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { clone } from "../../lib/object/clone";
import { Empty } from "../../lib/types/empty";
import { EquipmentInternalName } from "../data/data-equipment";
import { RpgEquipmentEffects } from "./rpg-equipment-effects";
import { RpgEquipmentLoadout } from "./rpg-equipment-loadout";

export interface RpgObtainedEquipment {
    id: Integer;
    name: EquipmentInternalName;
    loadoutIndex: Integer | null;
}

function createData() {
    return {
        nextId: 0 as Integer,
        list: Empty<RpgObtainedEquipment>(),
    };
}

type Data = ReturnType<typeof createData>;

export class RpgCharacterEquipment {
    private readonly _loadout: RpgEquipmentLoadout.Model = [null, null, null, null];
    private readonly _loadoutEffects = RpgEquipmentEffects.create();

    constructor(private _data: Data) {
        this._updateLoadout();
    }

    private _updateLoadout() {
        this._loadout[0] = null;
        this._loadout[1] = null;
        this._loadout[2] = null;
        this._loadout[3] = null;

        const { list } = this._data;

        let assertFailed = false;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.loadoutIndex === null) {
                continue;
            }

            if (this._loadout[item.loadoutIndex] !== null) {
                assertFailed = true;
            }
            this._loadout[item.loadoutIndex] = item.name;
        }

        if (assertFailed) {
            Logger.logAssertError(
                "RpgCharacterEquipment",
                new Error(
                    "The loadout appears invalid. One or more slots appeared more than once as loadoutIndex.",
                ),
                clone(this._loadout),
            );
        }

        RpgEquipmentLoadout.getEffects(this._loadout, this._loadoutEffects);
    }

    static createData = createData;

    count(name: EquipmentInternalName) {
        const { list } = this._data;

        let count = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) {
                count++;
            }
        }

        return count;
    }

    equip(id: Integer | null, loadoutIndex: Integer) {
        const { list } = this._data;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.id === id) {
                item.loadoutIndex = loadoutIndex;
            }
            else if (item.loadoutIndex === loadoutIndex) {
                item.loadoutIndex = null;
            }
        }
        this._updateLoadout();
    }

    get list(): Readonly<Data["list"]> {
        return this._data.list;
    }

    get loadout(): Readonly<RpgEquipmentLoadout.Model> {
        return this._loadout;
    }

    get loadoutEffects(): Readonly<RpgEquipmentEffects.Model> {
        return this._loadoutEffects;
    }

    receive(name: EquipmentInternalName) {
        this._data.list.push({ id: this._data.nextId++, name, loadoutIndex: null });
        this._updateLoadout();
    }

    static Preview = class RpgCharacterEquipmentPreview extends RpgCharacterEquipment {
        private readonly _dataToRestoreBeforeEquip: Data;

        constructor(equipment: RpgCharacterEquipment) {
            super(clone(equipment._data));
            this._dataToRestoreBeforeEquip = clone(equipment._data);
        }

        equip(id: Integer | null, slotIndex: Integer): void {
            this._data = clone(this._dataToRestoreBeforeEquip);
            super.equip(id, slotIndex);
        }
    };
}
