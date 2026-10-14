import { Integer } from "../../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../../lib/math/rng";
import { RpgFlops } from "../../../rpg/rpg-flops";

const prng = new PseudoRng();

export namespace EsotericPokeData {
    export interface Move {
        readonly name: string;
        readonly type: Move.Type;
        readonly speed: Move.Speed;
    }

    export namespace Move {
        export type Type = "laugh" | "soul" | "sword";

        export namespace Type {
            export const manifest = ["laugh", "soul", "sword"] as const;
            const effectivenessManifest: Record<Type, Record<Type, Integer>> = {
                soul: {
                    soul: 2,
                    laugh: 2,
                    sword: 0,
                },
                laugh: {
                    soul: 1,
                    laugh: 2,
                    sword: 1,
                },
                sword: {
                    soul: 2,
                    laugh: 2,
                    sword: 1,
                },
            };

            export function getEffectiveness(moveType: Type, targetStanceType: Type) {
                return effectivenessManifest[moveType][targetStanceType];
            }
        }

        export type Speed = 1 | 2 | 3 | 4;

        function create(type: Type, speed: Speed, name: string): Move {
            return { type, speed, name };
        }

        const manifest: Array<Move> = [
            create("laugh", 1, "Giggle"),
            create("laugh", 2, "Goof"),
            create("laugh", 3, "Tease"),
            create("laugh", 4, "Joke"),

            create("soul", 1, "Hold Hand"),
            create("soul", 2, "Hug"),
            create("soul", 3, "Confess"),
            create("soul", 4, "Promise"),

            create("sword", 1, "Poke"),
            create("sword", 2, "Pierce"),
            create("sword", 3, "Jab"),
            create("sword", 4, "Stab"),
        ];

        export function find(type: Type, speed: Speed) {
            return manifest.find(move => move.type === type && move.speed === speed)!;
        }
    }

    export interface Species {
        readonly health: Integer;
        readonly initialStanceType: Move.Type;
        readonly moves: ReadonlyArray<Move>;
    }

    export namespace Species {
        const nerfedTypeManifest: Move.Type[] = ["laugh", "laugh", "soul", "soul", "soul"];

        export function createFromFlopId(id: RpgFlops.Id): Species {
            prng.seed = id;
            prng.bool();

            const health = prng.intc(4, 8);
            const availableSpeedPoints = 40 - Math.pow(health, 1.3);

            // TODO sort at this level?
            const moves = [.26, .21, .19, .168]
                .map(f => {
                    const max = Math.min(4, Math.ceil(f * availableSpeedPoints));
                    const speed = prng.intc(1, max) as Move.Speed;

                    const typeManifest = prng.float(100) >= Math.pow(health, 2.15)
                        ? Move.Type.manifest
                        : nerfedTypeManifest;

                    return Move.find(prng.item(typeManifest), speed);
                });

            return {
                health,
                initialStanceType: prng.item(Move.Type.manifest),
                moves,
            };
        }
    }
}
