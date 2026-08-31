import { Seconds, Ticks } from "../../lib/math/number-alias-types";
import { DataTemporaryEffect } from "../data/data-temporary-effect";
import { RpgCutscene } from "./rpg-cutscene";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export class RpgPlayerTemporaryEffects {
    private _cacheKey = 0;
    private _buffMutatorFns = new Array<RpgPlayerBuffs.MutatorFn>();

    constructor(private readonly _state: RpgPlayerTemporaryEffects.State) {
        this._computeBuffMutatorFns();
    }

    get cacheKey() {
        return this._cacheKey;
    }

    get buffs(): ReadonlyArray<RpgPlayerBuffs.MutatorFn> {
        return this._buffMutatorFns;
    }

    get effects(): ReadonlyArray<Readonly<RpgPlayerTemporaryEffects.TemporaryEffect>> {
        return this._state.effects;
    }

    clear() {
        this._state.effects.length = 0;
        this._computeBuffMutatorFns();
    }

    add(id: DataTemporaryEffect.Id, durationSeconds: Seconds) {
        const durationTicks = Math.ceil(durationSeconds * 60);
        for (const effect of this._state.effects) {
            if (effect.id === id) {
                effect.duration.initial = Math.max(effect.duration.initial, durationTicks);
                effect.duration.remaining = Math.max(effect.duration.remaining, durationTicks);
                return;
            }
        }

        this._state.effects.push({
            id,
            duration: {
                initial: durationTicks,
                remaining: durationTicks,
            },
        });

        this._state.effects.sort((a, b) => a.id > b.id ? 1 : -1);

        this._computeBuffMutatorFns();
    }

    tick() {
        if (RpgCutscene.isPlaying) {
            return;
        }

        let needsRecompute = false;

        for (let i = 0; i < this._state.effects.length;) {
            const effect = this._state.effects[i];
            if (--effect.duration.remaining <= 0) {
                this._state.effects.splice(i, 1);
                needsRecompute = true;
                continue;
            }
            i++;
        }

        if (needsRecompute) {
            this._computeBuffMutatorFns();
        }
    }

    private _computeBuffMutatorFns() {
        this._cacheKey++;
        this._buffMutatorFns.length = 0;

        for (const effect of this._state.effects) {
            this._buffMutatorFns.push(DataTemporaryEffect.getById(effect.id).buffs);
        }
    }

    static createState(): RpgPlayerTemporaryEffects.State {
        return {
            effects: [],
        };
    }
}

export namespace RpgPlayerTemporaryEffects {
    export interface State {
        effects: TemporaryEffect[];
    }

    export interface TemporaryEffect {
        id: DataTemporaryEffect.Id;
        duration: {
            initial: Ticks;
            remaining: Ticks;
        };
    }
}
