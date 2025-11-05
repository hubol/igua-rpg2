import { Integer } from "../../lib/math/number-alias-types";
import { DataRespawnConfiguration } from "../data/data-respawn-configuration";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";

export class RpgPlayerAttributes {
    constructor(private readonly _state: RpgPlayerAttributes.State, private readonly _buffs: RpgPlayerAggregatedBuffs) {
    }

    get health() {
        return this._state.health + this._buffs.getAggregatedBuffs().attributes.health;
    }

    get intelligence() {
        return this._state.intelligence + this._buffs.getAggregatedBuffs().attributes.intelligence;
    }

    get strength() {
        return this._state.strength + this._buffs.getAggregatedBuffs().attributes.strength;
    }

    get respawnConfiguration() {
        return this._state.respawnConfiguration;
    }

    update(attributeKey: RpgPlayerAttributes.Point, delta: Integer) {
        this._state[attributeKey] += delta;
    }

    static createState(): RpgPlayerAttributes.State {
        return {
            health: 1,
            intelligence: 0,
            strength: 1,
            respawnConfiguration: "Indiana.University.Nurse",
        };
    }
}

export namespace RpgPlayerAttributes {
    export interface State {
        health: Integer;
        intelligence: Integer;
        strength: Integer;
        respawnConfiguration: DataRespawnConfiguration.Id;
    }

    export type Point = "health" | "intelligence" | "strength";
}
