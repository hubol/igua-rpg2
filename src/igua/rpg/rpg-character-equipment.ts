import { Integer } from "../../lib/math/number-alias-types";
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

export class RpgCharacterEquipment {
    private readonly _loadout: RpgEquipmentLoadout.Model = [null, null, null, null];
    private readonly _loadoutEffects = RpgEquipmentEffects.create();

    constructor(private readonly _data: Data) {
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

        for (let i = 0; i < list.length; i++) {
            // TODO debug assert that equippedSlotIndex only appears once!
            const item = list[i];
            if (item.equippedSlotIndex !== null) {
                this._loadout[item.equippedSlotIndex] = item.name;
            }
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

    equip(id: Integer, slotIndex: Integer) {
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
}
