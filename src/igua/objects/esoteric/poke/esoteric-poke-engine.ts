import { Coro } from "../../../../lib/game-engine/routines/coro";
import { Integer } from "../../../../lib/math/number-alias-types";
import { EsotericPokeData } from "./esoteric-poke-data";

export namespace EsotericPokeEngine {
    export interface TrainerChoiceModality {
        coroChooseMove(moves: ReadonlyArray<Animal.Move>): Coro.Type<Animal.Move>;
    }

    export class Trainer {
        constructor(
            private readonly _choiceModality: TrainerChoiceModality,
            readonly animal: Animal,
        ) {
        }

        *coroGetPlan(targetAnimal: Animal): Coro.Type<Trainer.Plan> {
            const move = yield* this._choiceModality.coroChooseMove(this.animal.moves);
            return new Trainer.Plan(
                this,
                targetAnimal,
                move,
            );
        }
    }

    export namespace Trainer {
        export class Plan {
            constructor(
                readonly actingTrainer: Trainer,
                readonly targetAnimal: Animal,
                readonly move: Animal.Move,
            ) {
            }

            get actingAnimal() {
                return this.actingTrainer.animal;
            }

            get speed() {
                return this.move.data.speed;
            }

            execute() {
                const damage = EsotericPokeData.Move.Type.getEffectiveness(
                    this.move.data.type,
                    this.targetAnimal.stanceType,
                );
                const previousTargetHealth = this.targetAnimal.health;
                this.targetAnimal.health = Math.max(0, this.targetAnimal.health - damage);
                const effectiveDamage = previousTargetHealth - this.targetAnimal.health;

                this.move.isUsed = true;
                this.actingAnimal.stanceType = this.move.data.type;
                return {
                    damage: effectiveDamage,
                    targetDefeated: !this.targetAnimal.isAlive,
                };
            }

            fail() {
                this.move.isUsed = true;
            }
        }
    }

    export class Animal {
        stanceType: EsotericPokeData.Move.Type;
        readonly moves: ReadonlyArray<Animal.Move>;
        health: number;
        readonly healthMax: number;

        constructor(readonly species: EsotericPokeData.Species) {
            this.stanceType = species.initialStanceType;
            this.moves = species.moves.map(x => new Animal.Move(x));
            this.health = species.health;
            this.healthMax = this.health;
        }

        get isAlive() {
            return this.health > 0;
        }

        tryReplenishMoves() {
            if (this.moves.find(x => !x.isUsed)) {
                return;
            }

            for (const move of this.moves) {
                move.isUsed = false;
            }
        }
    }

    export namespace Animal {
        export class Move {
            isUsed = false;

            constructor(readonly data: EsotericPokeData.Move) {
            }
        }
    }

    export namespace Battle {
        export type Event =
            | Event.RoundStarted
            | Event.MovesChosen
            | Event.MovesFailed
            | Event.RoundEnded
            | Event.MoveStart
            | Event.MoveOutcome;

        export namespace Event {
            export interface MovesFailed {
                kind: "moves_failed";
            }

            export interface RoundStarted {
                kind: "round_started";
            }

            export interface RoundEnded {
                kind: "round_ended";
            }

            export interface MovesChosen {
                kind: "moves_chosen";
            }

            export interface MoveStart {
                kind: "move_start";
                actingAnimal: Animal;
                move: EsotericPokeData.Move;
            }

            export interface MoveOutcome {
                kind: "move_outcome";
                damage: Integer;
                targetAnimal: Animal;
            }
        }

        export interface EventHandler {
            handle(event: Event): Coro.Type;
        }

        export function* coroExecute({ trainers, events }: coroExecute.Config): Coro.Type<{ winningTrainer: Trainer }> {
            while (true) {
                for (const trainer of trainers) {
                    trainer.animal.tryReplenishMoves();
                }
                yield* events.handle({ kind: "round_started" });
                const plans = yield* Coro.all(
                    trainers.map((trainer, i) => trainer.coroGetPlan(trainers[(i + 1) % trainers.length].animal)),
                );
                yield* events.handle({ kind: "moves_chosen" });
                if (plans[0].speed === plans[1].speed) {
                    for (const plan of plans) {
                        plan.fail();
                    }
                    yield* events.handle({ kind: "moves_failed" });
                    yield* events.handle({ kind: "round_ended" });
                    continue;
                }
                for (const plan of plans.sort((a, b) => b.speed - a.speed)) {
                    yield* events.handle({ kind: "move_start", actingAnimal: plan.actingAnimal, move: plan.move.data });
                    const result = plan.execute();
                    yield* events.handle({
                        kind: "move_outcome",
                        targetAnimal: plan.targetAnimal,
                        damage: result.damage,
                    });
                    if (result.targetDefeated) {
                        return { winningTrainer: plan.actingTrainer };
                    }
                }
                yield* events.handle({ kind: "round_ended" });
            }
        }

        namespace coroExecute {
            export interface Config {
                trainers: [Trainer, Trainer];
                events: EventHandler;
            }
        }
    }
}
