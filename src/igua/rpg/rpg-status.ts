import { blendColorDelta } from "../../lib/color/blend-color";
import { Integer, PercentInt, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Rpg } from "./rpg";
import { RpgAttack } from "./rpg-attack";
import { RpgCutscene } from "./rpg-cutscene";
import { RpgFaction } from "./rpg-faction";

export namespace RpgStatus {
    const Consts = {
        FullyPoisonedHealth: 5,
    };

    export namespace BodyPart {
        export interface Model {
            defenses: {
                physical: PercentInt;
            };
        }

        export const defenseless: Model = {
            defenses: {
                physical: 0,
            },
        };
    }

    export interface Model {
        faction: RpgFaction;
        health: number;
        healthMax: number;
        invulnerable: number;
        invulnerableMax: number;
        pride: number;
        conditions: {
            helium: {
                ballonDrainFactor: PercentInt;
                ballons: Ballon[];
                value: Integer;
                max: Integer;
            };
            poison: {
                damageScale: Integer;
                rateFactor: PercentInt;
                immune: boolean;
                level: number;
                levelMax: number;
                ticksCount: Integer;
                value: number;
                max: number;
            };
            wetness: {
                tint: RgbInt;
                value: Integer;
                max: Integer;
            };
            overheat: {
                value: Integer;
                max: Integer;
            };
        };
        guardingDefenses: {
            physical: PercentInt;
        };
        defenses: {
            physical: PercentInt;
        };
        factionDefenses: Record<RpgFaction, PercentInt>;
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
            isImmuneToPlayerMeleeAttack: boolean;
            // Feels weird that this quirk is not handled by any of the "methods" in RpgStatus
            // But maybe it is OK.
            successfulAttacksRewardExperience: boolean;
        };
        // TODO name is kind of strange
        // In reality, these are kind of like quirks that
        // can change very frequently
        state: {
            overheatValueThisTick: Integer;
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
        Overheat,
    }

    export interface Effects {
        ballonHealthDepleted(ballon: Ballon): void;
        ballonCreated(ballon: Ballon): void;
        healed(value: number, delta: number): void;
        tookDamage(
            remainingHealth: Integer,
            physicalDamage: Integer,
            emotionalDamage: Integer,
            poisonDamage: Integer,
            overheatDamage: Integer,
            attacker: Model | null,
            attack: RpgAttack.Model | null,
        ): void;
        died(attacker: Model | null): void;
    }

    interface DamageAccepted {
        rejected: false;
        attacker: RpgStatus.Model | null;
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
            model.state.overheatValueThisTick = 0;

            if (RpgCutscene.isPlaying && !model.quirks.ailmentsRecoverWhileCutsceneIsPlaying) {
                return;
            }

            if (model.conditions.poison.level > 0) {
                if (model.health > Consts.FullyPoisonedHealth) {
                    const previous = model.health;
                    const factor = 1 / (Math.max(1, model.conditions.poison.rateFactor) / 100);
                    const maxTick = Math.max(1, Math.round(120 * factor));
                    const secondDamageTick = Math.min(maxTick - 1, Math.round(40 * factor));
                    const rawDamagePerTick = (model.conditions.poison.level / 2) * model.conditions.poison.damageScale;

                    if (model.conditions.poison.ticksCount % maxTick === 0) {
                        model.health = Math.max(
                            Consts.FullyPoisonedHealth,
                            model.health
                                - Math.ceil(rawDamagePerTick),
                        );
                    }
                    if (model.conditions.poison.ticksCount % maxTick === secondDamageTick) {
                        model.health = Math.max(
                            Consts.FullyPoisonedHealth,
                            model.health
                                - Math.floor(rawDamagePerTick),
                        );
                    }

                    const diff = previous - model.health;

                    if (diff > 0) {
                        effects.tookDamage(
                            model.health,
                            0,
                            0,
                            diff,
                            0,
                            null,
                            null,
                        );
                    }
                }

                model.conditions.poison.ticksCount++;
            }
            else {
                model.conditions.poison.ticksCount = -1;
            }

            if (count % 20 === 0) {
                model.conditions.helium.value = Math.max(
                    0,
                    Math.min(model.conditions.helium.max, model.conditions.helium.value) - 1,
                );
            }
            if (count % 15 === 0) {
                model.conditions.poison.value = Math.max(
                    0,
                    Math.min(model.conditions.poison.max, model.conditions.poison.value) - 1,
                );
            }
            if (count % 4 === 0) {
                model.conditions.wetness.value = Math.max(
                    0,
                    Math.min(model.conditions.wetness.max, model.conditions.wetness.value) - model.recoveries.wetness,
                );
                model.conditions.overheat.value = Math.max(
                    0,
                    Math.min(model.conditions.overheat.max, model.conditions.overheat.value) - 1,
                );
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
            targetBodyPart: BodyPart.Model,
            targetEffects: Effects,
            attack: RpgAttack.Model,
            attacker: RpgStatus.Model | null = null,
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
                    || attack.conditions.poison.value > 0
                    || attack.conditions.wetness.value > 0
                    || attack.conditions.overheat.value > 0);

            let overheatAttack = 0;

            if (conditions) {
                target.conditions.helium.value += attack.conditions.helium;
                if (target.conditions.helium.value >= target.conditions.helium.max) {
                    target.conditions.helium.value = 0;
                    RpgStatus.Methods.createBallon(target, targetEffects);
                }

                const overheatValue = Math.max(
                    0,
                    attack.conditions.overheat.value - target.state.overheatValueThisTick,
                );

                target.state.overheatValueThisTick += overheatValue;

                target.conditions.overheat.value = Math.min(
                    target.conditions.overheat.value + overheatValue,
                    target.conditions.overheat.max - (target.invulnerable > 0 ? 1 : 0),
                );

                if (target.conditions.overheat.value >= target.conditions.overheat.max) {
                    target.conditions.overheat.value = 0;
                    overheatAttack = attack.conditions.overheat.damage;
                }

                if (!target.conditions.poison.immune) {
                    target.conditions.poison.value += attack.conditions.poison.value;
                    const max = Math.max(1, target.conditions.poison.max);

                    while (target.conditions.poison.value >= max) {
                        if (target.conditions.poison.level >= attack.conditions.poison.maxLevel) {
                            target.conditions.poison.value = max - 1;
                            break;
                        }

                        target.conditions.poison.value = Math.max(
                            0,
                            target.conditions.poison.value - target.conditions.poison.max,
                        );
                        target.conditions.poison.level = Math.min(
                            target.conditions.poison.levelMax,
                            target.conditions.poison.level + 1,
                        );
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

            if (attack.physical === 0 && attack.emotional === 0 && overheatAttack === 0) {
                return { rejected: false, ambient, attacker };
            }

            if (target.invulnerable > 0) {
                return { rejected: true, invulnerable: true };
            }

            const factionDefense = attacker ? target.factionDefenses[attacker.faction] : 0;

            const canBeFatal = !target.state.isGuarding || target.quirks.guardedDamageIsFatal || target.health <= 1;

            const tookEmotionalDamage = takeDamage(
                attack.emotional,
                canBeFatal && target.quirks.emotionalDamageIsFatal,
                // TODO emotional defense
                0,
                0,
                factionDefense,
                target,
            );

            const tookPhysicalDamage = takeDamage(
                attack.physical,
                canBeFatal,
                Math.max(0, target.defenses.physical + targetBodyPart.defenses.physical),
                Math.max(0, target.guardingDefenses.physical + targetBodyPart.defenses.physical),
                factionDefense,
                target,
            );

            const tookOverheatDamage = takeDamage(
                overheatAttack,
                canBeFatal,
                // TODO should there be overheat defense
                0,
                0,
                factionDefense,
                target,
            );

            const damaged = tookEmotionalDamage > 0 || tookPhysicalDamage > 0 || tookOverheatDamage > 0;
            target.invulnerable = target.invulnerableMax;

            targetEffects.tookDamage(
                target.health,
                tookPhysicalDamage,
                tookEmotionalDamage,
                0,
                tookOverheatDamage,
                attacker,
                attack,
            );

            if (damaged && target.health <= 0) {
                targetEffects.died(attacker);
            }

            if (damaged && attacker && target.quirks.incrementsAttackerPrideOnDamage) {
                attacker.pride++;
            }

            return { rejected: false, ambient, damaged, attacker };
        },

        heal(model: Model, effects: Effects, amount: number) {
            // TODO warn when amount is not an integer

            const previous = model.health;
            model.health = Math.min(Math.max(model.health, model.healthMax), model.health + amount);
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
        amount: Integer,
        canBeFatal: boolean,
        defense: PercentInt,
        guardingDefense: PercentInt,
        factionDefense: PercentInt,
        target: Model,
    ) {
        const previous = target.health;
        const totalDefense: PercentInt = defense
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

        return diff;
    }
}
