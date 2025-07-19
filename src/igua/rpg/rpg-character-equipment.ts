import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { clone } from "../../lib/object/clone";
import { Empty } from "../../lib/types/empty";
import { DataEquipment } from "../data/data-equipment";
import { RpgEquipmentLoadout } from "./rpg-equipment-loadout";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export class RpgCharacterEquipment {
    private readonly _loadout: RpgEquipmentLoadout.Model = [null, null, null, null];
    private readonly _loadoutBuffs = RpgPlayerBuffs.create();
    private _loadoutUpdatesCount = 0;

    constructor(private _state: RpgCharacterEquipment.State) {
        this._updateLoadout();
    }

    private _updateLoadout() {
        this._loadout[0] = null;
        this._loadout[1] = null;
        this._loadout[2] = null;
        this._loadout[3] = null;

        const { list } = this._state;

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

        RpgEquipmentLoadout.getPlayerBuffs(this._loadout, this._loadoutBuffs);
        this._loadoutUpdatesCount++;
    }

    count(equipmentId: DataEquipment.Id) {
        const { list } = this._state;

        let count = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === equipmentId) {
                count++;
            }
        }

        return count;
    }

    equip(id: Integer | null, loadoutIndex: Integer) {
        const { list } = this._state;

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

    get list(): ReadonlyArray<Readonly<RpgCharacterEquipment.ObtainedEquipment>> {
        return this._state.list;
    }

    get loadout(): Readonly<RpgEquipmentLoadout.Model> {
        return this._loadout;
    }

    get loadoutBuffs(): Readonly<RpgPlayerBuffs.Model> {
        return this._loadoutBuffs;
    }

    get loadoutUpdatesCount() {
        return this._loadoutUpdatesCount;
    }

    receive(equipmentId: DataEquipment.Id) {
        this._state.list.push({ id: this._state.nextId++, name: equipmentId, loadoutIndex: null });
        this._updateLoadout();
    }

    static Preview = class RpgCharacterEquipmentPreview extends RpgCharacterEquipment {
        private readonly _stateToRestoreBeforeEquip: RpgCharacterEquipment.State;

        constructor(equipment: RpgCharacterEquipment) {
            super(clone(equipment._state));
            this._stateToRestoreBeforeEquip = clone(equipment._state);
        }

        equip(id: Integer | null, slotIndex: Integer): void {
            this._state = clone(this._stateToRestoreBeforeEquip);
            super.equip(id, slotIndex);
        }
    };

    static createState(): RpgCharacterEquipment.State {
        return {
            nextId: 0,
            list: [],
        };
    }
}

export module RpgCharacterEquipment {
    export interface ObtainedEquipment {
        id: Integer;
        // TODO rename to equipmentId
        name: DataEquipment.Id;
        loadoutIndex: Integer | null;
    }

    export interface State {
        nextId: Integer;
        list: Array<RpgCharacterEquipment.ObtainedEquipment>;
    }
}
