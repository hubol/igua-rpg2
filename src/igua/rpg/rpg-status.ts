import { Integer, PercentAsInteger } from "../../lib/math/number-alias-types";
import { RpgAttack } from "./rpg-attack";
import { RpgEnemy } from "./rpg-enemy";
import { RpgFaction } from "./rpg-faction";

export namespace RpgStatus {
    const Consts = {
        FullyPoisonedHealth: 5,
    };

    export interface Model {
        faction: RpgFaction;
        health: number;
        healthMax: number;
        invulnerable: number;
        invulnerableMax: number;
        isGuarding: boolean;
        poison: {
            immune: boolean;
            level: number;
            value: number;
            max: number;
        };
        wetness: {
            value: Integer;
            max: Integer;
        };
        guardingDefenses: {
            physical: PercentAsInteger;
        };
        defenses: {
            physical: PercentAsInteger;
        };
        quirks: {
            incrementsAttackerPrideOnDamage: boolean;
            emotionalDamageIsFatal: boolean;
            roundReceivedDamageUp: boolean;
            guardedDamageIsFatal: boolean;
        };
    }

    export enum DamageKind {
        Physical,
        Poison,
        Emotional,
    }

    export interface Effects {
        healed(value: number, delta: number): void;
        tookDamage(value: number, delta: number, kind: DamageKind): void;
        died(): void;
    }

    interface DamageAccepted {
        rejected: false;
        ailments?: boolean;
        damaged?: boolean;
    }

    interface DamageRejected {
        rejected: true;
        wrongFaction?: boolean;
        invulnerable?: boolean;
    }

    export type DamageResult = DamageAccepted | DamageRejected;

    export const Methods = {
        tick(model: Model, effects: Effects, count: number) {
            if (count % 120 === 0 && model.health > Consts.FullyPoisonedHealth && model.poison.level > 0) {
                const previous = model.health;
                model.health = Math.max(Consts.FullyPoisonedHealth, model.health - model.poison.level);
                const diff = previous - model.health;

                effects.tookDamage(model.health, diff, DamageKind.Poison);
            }
            if (count % 15 === 0) {
                model.poison.value = Math.max(0, model.poison.value - 1);
            }
            if (count % 4 === 0) {
                model.wetness.value = Math.max(0, model.wetness.value - 1);
            }
            model.invulnerable = Math.max(0, model.invulnerable - 1);
        },

        damage(model: Model, effects: Effects, attack: RpgAttack.Model, attacker?: RpgEnemy.Model): DamageResult {
            if (attack.versus !== RpgFaction.Anyone && attack.versus !== model.faction) {
                return { rejected: true, wrongFaction: true };
            }

            const ailments = attack.poison > 0 || attack.wetness > 0;

            if (!model.poison.immune) {
                model.poison.value += attack.poison;
                if (model.poison.value >= model.poison.max) {
                    model.poison.value = 0;
                    model.poison.level += 1;
                }
            }

            model.wetness.value = Math.min(model.wetness.value + attack.wetness, model.wetness.max);

            // TODO should resistances to damage be factored here?
            // Or should that be computed in a previous step?

            // TODO warn when amount is not an integer

            if (attack.physical === 0 && attack.emotional === 0) {
                return { rejected: false, ailments };
            }

            if (model.invulnerable > 0) {
                return { rejected: true, invulnerable: true };
            }

            const minimumHealthAfterDamage =
                (!model.quirks.guardedDamageIsFatal && model.isGuarding && model.health > 1) ? 1 : 0;
            let damaged = false;

            {
                const previous = model.health;
                const min = model.quirks.emotionalDamageIsFatal ? minimumHealthAfterDamage : 1;
                model.health = Math.max(min, model.health - attack.emotional);
                const diff = previous - model.health;
                damaged ||= diff > 0;

                effects.tookDamage(model.health, diff, DamageKind.Emotional);
            }

            {
                const previous = model.health;
                const defense: PercentAsInteger = model.defenses.physical
                    + (model.isGuarding ? model.guardingDefenses.physical : 0);
                const damage = Math.max(
                    0,
                    Math[model.quirks.roundReceivedDamageUp ? "ceil" : "floor"](
                        attack.physical * ((100 - defense) / 100),
                    ),
                );
                model.health = Math.max(minimumHealthAfterDamage, model.health - damage);
                const diff = previous - model.health;
                damaged ||= diff > 0;

                effects.tookDamage(model.health, diff, DamageKind.Physical);
            }

            model.invulnerable = model.invulnerableMax;

            if (damaged && model.health <= 0) {
                effects.died();
            }

            if (damaged && attacker && model.quirks.incrementsAttackerPrideOnDamage) {
                attacker.pride++;
            }

            return { rejected: false, ailments, damaged };
        },

        heal(model: Model, effects: Effects, amount: number) {
            // TODO warn when amount is not an integer

            const previous = model.health;
            model.health = Math.min(model.healthMax, model.health + amount);
            const diff = model.health - previous;

            effects.healed(model.health, diff);
        },
    };
}
