import { blendColorDelta } from "../../lib/color/blend-color";
import { Integer, PercentAsInteger, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { RpgAttack } from "./rpg-attack";
import { RpgCutscene } from "./rpg-cutscene";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";
import { RpgFaction } from "./rpg-faction";

export namespace RpgStatus {
    const Consts = {
        FullyPoisonedHealth: 5,
    };

    export interface Model {
        ballons: Ballon[];
        faction: RpgFaction;
        health: number;
        healthMax: number;
        invulnerable: number;
        invulnerableMax: number;
        pride: number;
        poison: {
            immune: boolean;
            level: number;
            value: number;
            max: number;
        };
        wetness: {
            tint: RgbInt;
            value: Integer;
            max: Integer;
        };
        guardingDefenses: {
            physical: PercentAsInteger;
        };
        defenses: {
            physical: PercentAsInteger;
        };
        recoveries: {
            wetness: Integer;
        };
        quirks: {
            ailmentsRecoverWhileCutsceneIsPlaying: boolean;
            receivesDamageWhileCutsceneIsPlaying: boolean;
            incrementsAttackerPrideOnDamage: boolean;
            emotionalDamageIsFatal: boolean;
            roundReceivedDamageUp: boolean;
            guardedDamageIsFatal: boolean;
            attackingRewardsExperience: boolean;
        };
        // TODO name is kind of strange
        // In reality, these are kind of like quirks that
        // can change very frequently
        state: {
            ballonHealthMayDrain: boolean;
            isGuarding: boolean;
        };
    }

    export interface Ballon {
        health: Integer;
        healthMax: Integer;
        seed: Integer;
    }

    export function createBallon(): Ballon {
        return {
            health: 100,
            healthMax: 100,
            seed: Rng.intc(8_000_000, 24_000_000),
        };
    }

    export enum DamageKind {
        Physical,
        Poison,
        Emotional,
    }

    export interface Effects {
        ballonHealthDepleted(ballon: Ballon): void;
        ballonCreated(ballon: Ballon): void;
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
        doesntReceiveDamageWhileCutsceneIsPlaying?: boolean;
    }

    export type DamageResult = DamageAccepted | DamageRejected;

    export const Methods = {
        tick(model: Model, effects: Effects, count: number) {
            model.invulnerable = Math.max(0, model.invulnerable - 1);

            if (RpgCutscene.isPlaying && !model.quirks.ailmentsRecoverWhileCutsceneIsPlaying) {
                return;
            }

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
                model.wetness.value = Math.max(0, model.wetness.value - model.recoveries.wetness);
            }
            if (model.state.ballonHealthMayDrain && count % 8 === 0) {
                // TODO ballon health should only drain while airborne!
                let i = 0;
                while (i < model.ballons.length) {
                    const ballon = model.ballons[i];
                    ballon.health = Math.max(0, ballon.health - 1);
                    if (ballon.health === 0) {
                        model.ballons.splice(i, 1);
                        effects.ballonHealthDepleted(ballon);
                    }
                    else {
                        i++;
                    }
                }
            }
        },

        damage(
            target: Model,
            targetEffects: Effects,
            attack: RpgAttack.Model,
            attacker?: RpgStatus.Model,
        ): DamageResult {
            if (RpgCutscene.isPlaying && !target.quirks.receivesDamageWhileCutsceneIsPlaying) {
                return { rejected: true, doesntReceiveDamageWhileCutsceneIsPlaying: true };
            }

            if (attack.versus !== RpgFaction.Anyone && attack.versus !== target.faction) {
                return { rejected: true, wrongFaction: true };
            }

            const ailments = attack.poison > 0 || attack.wetness.value > 0;

            if (!target.poison.immune) {
                target.poison.value += attack.poison;
                if (target.poison.value >= target.poison.max) {
                    target.poison.value = 0;
                    target.poison.level += 1;
                }
            }

            if (attack.wetness.value > 0) {
                if (target.wetness.value === 0) {
                    target.wetness.tint = attack.wetness.tint;
                }
                else {
                    target.wetness.tint = blendColorDelta(target.wetness.tint, attack.wetness.tint, 4);
                }
            }
            target.wetness.value = Math.min(target.wetness.value + attack.wetness.value, target.wetness.max);

            // TODO warn when amount is not an integer

            if (attack.physical === 0 && attack.emotional === 0) {
                return { rejected: false, ailments };
            }

            if (target.invulnerable > 0) {
                return { rejected: true, invulnerable: true };
            }

            const canBeFatal = !target.state.isGuarding || target.quirks.guardedDamageIsFatal || target.health <= 1;

            const attackingRewardsExperience = attacker?.quirks?.attackingRewardsExperience ?? false;

            const tookEmotionalDamage = takeDamage(
                attack,
                attack.emotional,
                DamageKind.Emotional,
                canBeFatal && target.quirks.emotionalDamageIsFatal,
                // TODO emotional defense
                0,
                0,
                target,
                targetEffects,
                attackingRewardsExperience,
            );

            const tookPhysicalDamage = takeDamage(
                attack,
                attack.physical,
                DamageKind.Physical,
                canBeFatal,
                target.defenses.physical,
                target.guardingDefenses.physical,
                target,
                targetEffects,
                attackingRewardsExperience,
            );

            const damaged = tookEmotionalDamage || tookPhysicalDamage;
            target.invulnerable = target.invulnerableMax;

            if (damaged && target.health <= 0) {
                if (attackingRewardsExperience) {
                    RpgExperienceRewarder.combat.onEnemyDefeat(target.healthMax);
                }
                targetEffects.died();
            }

            if (damaged && attacker && target.quirks.incrementsAttackerPrideOnDamage) {
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

        createBallon(model: Model, effects: Effects) {
            const ballon = createBallon();
            model.ballons.push(ballon);
            effects.ballonCreated(ballon);
        },
    };

    function takeDamage(
        attack: RpgAttack.Model,
        amount: Integer,
        kind: DamageKind,
        canBeFatal: boolean,
        defense: PercentAsInteger,
        guardingDefense: PercentAsInteger,
        target: Model,
        targetEffects: Effects,
        rewardExperience: boolean,
    ) {
        const previous = target.health;
        const totalDefense: PercentAsInteger = defense
            + (target.state.isGuarding ? guardingDefense : 0);

        const minimumDamage = totalDefense >= 100 ? 0 : Math.sign(amount);

        const damage = Math.max(
            minimumDamage,
            Math[target.quirks.roundReceivedDamageUp ? "ceil" : "floor"](
                amount * ((100 - totalDefense) / 100),
            ),
        );

        const minimumHealthAfterDamage = Math.min(canBeFatal ? 0 : 1, target.health);

        target.health = Math.max(minimumHealthAfterDamage, target.health - damage);
        const diff = previous - target.health;

        if (rewardExperience && diff > 0) {
            RpgExperienceRewarder.combat.onAttackDamage(attack, diff);
        }

        targetEffects.tookDamage(target.health, diff, kind);

        return diff > 0;
    }
}
