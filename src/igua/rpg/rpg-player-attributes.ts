import { Logger } from "../../lib/game-engine/logger";
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

    get vision() {
        return this._buffs.getAggregatedBuffs().esoteric.nightVisionLevel;
    }

    get respawnConfiguration() {
        return this._state.respawnConfiguration;
    }

    set respawnConfiguration(value) {
        this._state.respawnConfiguration = value;
    }

    update(attributeKey: RpgPlayerAttributes.Point, delta: Integer) {
        this._state[attributeKey] += delta;
    }

    readonly names = new RpgPlayerNames(this._state.names);

    static createState(): RpgPlayerAttributes.State {
        return {
            health: 1,
            intelligence: 0,
            strength: 1,
            respawnConfiguration: "Indiana.University.Nurse",
            names: RpgPlayerNames.createState(),
        };
    }
}

export namespace RpgPlayerAttributes {
    export interface State {
        health: Integer;
        intelligence: Integer;
        strength: Integer;
        respawnConfiguration: DataRespawnConfiguration.Id;
        names: RpgPlayerNames.State;
    }

    export type Point = "health" | "intelligence" | "strength";
}

class RpgPlayerNames {
    constructor(private readonly _state: RpgPlayerNames.State) {
    }

    onCalledName(name: string) {
        name = name.trim();

        if (!name) {
            Logger.logContractViolationError(
                "RpgPlayerNames",
                new Error("Trying to call player falsy name"),
                { name },
            );
            return;
        }

        if (this._state.availableNames.has(name)) {
            return false;
        }

        this._state.availableNames.add(name);
        this._state.currentName = name;
        return true;
    }

    chooseNameFromAvailable(name: string) {
        if (!this._state.availableNames.has(name)) {
            Logger.logContractViolationError(
                "RpgPlayerNames",
                new Error("Trying to select unavailable name"),
                { name },
            );
            return;
        }

        this._state.currentName = name;
    }

    get current() {
        return this._state.currentName;
    }

    get availableList(): ReadonlyArray<string> {
        return new Array(...this._state.availableNames);
    }

    static createState(): RpgPlayerNames.State {
        return {
            availableNames: new Set(["You"]),
            currentName: "You",
        };
    }
}

namespace RpgPlayerNames {
    export interface State {
        availableNames: Set<string>;
        currentName: string;
    }
}
