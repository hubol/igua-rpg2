import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { clone } from "../../lib/object/clone";
import { Empty } from "../../lib/types/empty";
import { EquipmentInternalName } from "../data/data-equipment";
import { RpgEquipmentEffects } from "./rpg-equipment-effects";
import { RpgEquipmentLoadout } from "./rpg-equipment-loadout";

function createData() {
    return {
        nextId: 0 as Integer,
        list: Empty<{ id: Integer; name: EquipmentInternalName; equippedSlotIndex: Integer | null }>(),
    };
}

type Data = ReturnType<typeof createData>;

type RpgCharacterEquipmentData_List = Data["list"];
export type RpgCharacterEquipmentData_ListItem = Data["list"][number];

const debugSet = new Set<Integer>();

export class RpgCharacterEquipment {
    private readonly _loadout: RpgEquipmentLoadout.Model = [null, null, null, null];
    private readonly _loadoutEffects = RpgEquipmentEffects.create();

    constructor(private _data: Data) {
        // TODO remove!!!!!!!
        this.receive("JumpAtSpecialSignsRing");
        this.receive("NailFile");
        this.receive("PatheticCage");
        this.receive("PoisonRing");
        this.receive("RichesRing");
        this.receive("YellowRichesRing");
        this._updateLoadout();
    }

    private _updateLoadout() {
        this._loadout[0] = null;
        this._loadout[1] = null;
        this._loadout[2] = null;
        this._loadout[3] = null;

        const { list } = this._data;

        debugSet.clear();
        let assertFailed = false;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.equippedSlotIndex !== null) {
                this._loadout[item.equippedSlotIndex] = item.name;
                if (debugSet.has(item.equippedSlotIndex)) {
                    assertFailed = true;
                }
                else {
                    debugSet.add(item.equippedSlotIndex);
                }
            }
        }

        if (assertFailed) {
            Logger.logAssertError(
                "RpgCharacterEquipment",
                new Error(
                    "The loadout appears invalid. One or more slots appeared more than once as equippedSlotIndex.",
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

    // TODO remove
    dequip(slotIndex: Integer) {
        const { list } = this._data;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.equippedSlotIndex === slotIndex) {
                item.equippedSlotIndex = null;
            }
        }
        this._updateLoadout();
    }

    equip(id: Integer | null, slotIndex: Integer) {
        const { list } = this._data;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.id === id) {
                item.equippedSlotIndex = slotIndex;
            }
            else if (item.equippedSlotIndex === slotIndex) {
                item.equippedSlotIndex = null;
            }
        }
        this._updateLoadout();
    }

    get list(): Readonly<RpgCharacterEquipmentData_List> {
        return this._data.list;
    }

    get loadout(): Readonly<RpgEquipmentLoadout.Model> {
        return this._loadout;
    }

    get loadoutEffects(): Readonly<RpgEquipmentEffects.Model> {
        return this._loadoutEffects;
    }

    receive(name: EquipmentInternalName) {
        this._data.list.push({ id: this._data.nextId++, name, equippedSlotIndex: null });
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
