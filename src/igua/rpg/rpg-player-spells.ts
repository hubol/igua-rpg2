import { Integer } from "../../lib/math/number-alias-types";
import { DataSpell } from "../data/data-spell";
import { RpgAttack } from "./rpg-attack";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";

export class RpgPlayerSpells {
    private readonly _equippableSpells: RpgPlayerSpells.EquippableSpells;
    private readonly _equippableSpellsList: RpgPlayerSpell[];

    constructor(
        private readonly _state: RpgPlayerSpells.State,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
    ) {
        this._equippableSpells = createEquippableSpells(this._buffs);
        this._equippableSpellsList = Object.values(this._equippableSpells);
    }

    get anyEquipped() {
        for (let i = 0; i < this._equippableSpellsList.length; i++) {
            if (this._equippableSpellsList[i].isEquipped) {
                return true;
            }
        }

        return false;
    }

    cast() {
        if (this._state.power >= this.maxPower) {
            this._state.power = 0;
            return this._equippableSpells;
        }

        return null;
    }

    tick() {
        this._state.power = Math.max(0, Math.min(this.maxPower, this._state.power + 1));
    }

    get powerUnit() {
        if (this.maxPower < 1) {
            return 0;
        }
        return Math.min(1, this._state.power / this.maxPower);
    }

    get maxPower() {
        return this._buffs.getAggregatedBuffs().combat.spells.maxPower;
    }

    static createState(): RpgPlayerSpells.State {
        return {
            power: 0,
        };
    }
}

function createEquippableSpells(buffs: RpgPlayerAggregatedBuffs): RpgPlayerSpells.EquippableSpells {
    const equippableSpells: Record<string, RpgPlayerSpell> = Object.fromEntries(
        DataSpell.Ids.map(spellId => [spellId, new RpgPlayerSpell(spellId, buffs)]),
    );

    return equippableSpells as any;
}

export namespace RpgPlayerSpells {
    export interface State {
        power: Integer;
    }

    export type EquippableSpells = Record<DataSpell.Id, RpgPlayerSpell>;
}

class RpgPlayerSpell {
    constructor(
        private readonly _spellId: DataSpell.Id,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
    ) {
        this._attackLevelRef = { level: 0 };
        this._attack = DataSpell.getById(this._spellId).attackProvider(this._attackLevelRef);
    }

    private readonly _attackLevelRef: RpgPlayerSpell.LevelRef;
    private readonly _attack: RpgAttack.Model;

    get attack() {
        // TODO could be theoretically buffed by attributes
        this._attackLevelRef.level = this.level;
        return this._attack;
    }

    get isEquipped() {
        return this.level > 0;
    }

    get level() {
        return this._buffs.getAggregatedBuffs().combat.spells.equipped[this._spellId];
    }
}

namespace RpgPlayerSpell {
    export interface LevelRef {
        level: Integer;
    }
}
