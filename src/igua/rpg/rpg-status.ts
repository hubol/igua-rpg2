import { blendColorDelta } from "../../lib/color/blend-color";
import { Integer, PercentAsInteger, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Rpg } from "./rpg";
import { RpgAttack } from "./rpg-attack";
import { RpgCutscene } from "./rpg-cutscene";
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
        pride: number;
        conditions: {
            helium: {
                ballonDrainFactor: PercentAsInteger;
                ballons: Ballon[];
                value: Integer;
                max: Integer;
            };
            poison: {
                immune: boolean;
                level: number;
                ticksCount: Integer;
                value: number;
                max: number;
            };
            wetness: {
                tint: RgbInt;
                value: Integer;
                max: Integer;
            };
        };
        guardingDefenses: {
            physical: PercentAsInteger;
        };
        defenses: {
            physical: PercentAsInteger;
        };
        factionDefenses: Record<RpgFaction, PercentAsInteger>;
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
            isImmuneToPlayerMeleeAttack: boolean;
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
            health: 100 * 800,
            healthMax: 100 * 800,
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
        ambient?: boolean;
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

            if (model.conditions.poison.level > 0) {
                if (model.health > Consts.FullyPoisonedHealth) {
                    const previous = model.health;

                    if (model.conditions.poison.ticksCount % 120 === 0) {
                        model.health = Math.max(
                            Consts.FullyPoisonedHealth,
                            model.health - Math.ceil(model.conditions.poison.level / 2),
                        );
                    }
                    else if (model.conditions.poison.ticksCount % 120 === 40) {
                        model.health = Math.max(
                            Consts.FullyPoisonedHealth,
                            model.health - Math.floor(model.conditions.poison.level / 2),
                        );
                    }

                    const diff = previous - model.health;

                    if (diff > 0) {
                        effects.tookDamage(model.health, diff, DamageKind.Poison);
                    }
                }

                model.conditions.poison.ticksCount++;
            }
            else {
                model.conditions.poison.ticksCount = -1;
            }

            if (count % 20 === 0) {
                model.conditions.helium.value = Math.max(0, model.conditions.helium.value - 1);
            }
            if (count % 15 === 0) {
                model.conditions.poison.value = Math.max(0, model.conditions.poison.value - 1);
            }
            if (count % 4 === 0) {
                model.conditions.wetness.value = Math.max(0, model.conditions.wetness.value - model.recoveries.wetness);
            }
            if (model.state.ballonHealthMayDrain) {
                const healthDelta = -Math.max(1, model.conditions.helium.ballonDrainFactor);

                let i = 0;
                while (i < model.conditions.helium.ballons.length) {
                    const ballon = model.conditions.helium.ballons[i];
                    ballon.health = Math.max(0, ballon.health + healthDelta);
                    if (ballon.health === 0) {
                        model.conditions.helium.ballons.splice(i, 1);
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

            if (attack.quirks.isPlayerMeleeAttack && target.quirks.isImmuneToPlayerMeleeAttack) {
                return { rejected: true, invulnerable: true };
            }

            const ambient = !attack.quirks.isPlayerClawMeleeAttack && !attack.quirks.isPlayerMeleeAttack
                && attack.physical === 0 && attack.emotional === 0;

            const conditions = target.invulnerable === 0
                && (attack.conditions.helium > 0
                    || attack.conditions.poison > 0
                    || attack.conditions.wetness.value > 0);

            if (conditions) {
                target.conditions.helium.value += attack.conditions.helium;
                if (target.conditions.helium.value >= target.conditions.helium.max) {
                    target.conditions.helium.value = 0;
                    RpgStatus.Methods.createBallon(target, targetEffects);
                }

                if (!target.conditions.poison.immune) {
                    target.conditions.poison.value += attack.conditions.poison;
                    while (target.conditions.poison.value >= Math.max(1, target.conditions.poison.max)) {
                        target.conditions.poison.value = Math.max(
                            0,
                            target.conditions.poison.value - target.conditions.poison.max,
                        );
                        target.conditions.poison.level += 1;
                    }
                }

                if (attack.conditions.wetness.value > 0) {
                    if (target.conditions.wetness.value === 0) {
                        target.conditions.wetness.tint = attack.conditions.wetness.tint;
                    }
                    else {
                        target.conditions.wetness.tint = blendColorDelta(
                            target.conditions.wetness.tint,
                            attack.conditions.wetness.tint,
                            Math.min(255, 4 + Math.max(attack.conditions.wetness.value - 30, 0)),
                        );
                    }
                }
                target.conditions.wetness.value = Math.min(
                    target.conditions.wetness.value + attack.conditions.wetness.value,
                    target.conditions.wetness.max,
                );
            }

            // TODO warn when amount is not an integer

            if (attack.physical === 0 && attack.emotional === 0) {
                return { rejected: false, ambient };
            }

            if (target.invulnerable > 0) {
                return { rejected: true, invulnerable: true };
            }

            const factionDefense = attacker ? target.factionDefenses[attacker.faction] : 0;

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
                factionDefense,
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
                factionDefense,
                target,
                targetEffects,
                attackingRewardsExperience,
            );

            const damaged = tookEmotionalDamage || tookPhysicalDamage;
            target.invulnerable = target.invulnerableMax;

            if (damaged && target.health <= 0) {
                if (attackingRewardsExperience) {
                    // TODO maybe instead have RpgExperience passed?
                    Rpg.experience.reward.combat.onEnemyDefeat(target.healthMax);
                }
                targetEffects.died();
            }

            if (damaged && attacker && target.quirks.incrementsAttackerPrideOnDamage) {
                attacker.pride++;
            }

            return { rejected: false, ambient, damaged };
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
            model.conditions.helium.ballons.push(ballon);
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
        factionDefense: PercentAsInteger,
        target: Model,
        targetEffects: Effects,
        rewardExperience: boolean,
    ) {
        const previous = target.health;
        const totalDefense: PercentAsInteger = defense
            + (target.state.isGuarding ? guardingDefense : 0)
            + factionDefense;

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
            Rpg.experience.reward.combat.onAttackDamage(attack, diff);
        }

        targetEffects.tookDamage(target.health, diff, kind);

        return diff > 0;
    }
}
