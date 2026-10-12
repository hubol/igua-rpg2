import { objText } from "../../../assets/fonts";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { DramaFlops } from "../../drama/drama-flops";
import { ask, show } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { objCharacterBoxer } from "../../objects/characters/obj-character-boxer";
import { EsotericPokeData } from "../../objects/esoteric/poke/esoteric-poke-data";
import { EsotericPokeEngine } from "../../objects/esoteric/poke/esoteric-poke-engine";

export function scnDevDramaFlops() {
    const lvl = Lvl.Dummy();

    const allSpecies = range(999).map(id => EsotericPokeData.Species.createFromFlopId(id));

    console.log(
        "speed 3 or above",
        allSpecies.filter(species => species.moves.filter(move => move.speed >= 3).length === 4).length,
    );

    console.log(
        "speed 2 or below",
        allSpecies.filter(species => species.moves.filter(move => move.speed <= 2).length === 4).length,
    );

    // for (let i = 0; i <= 998; i++) {
    //     const species = EsotericPokeData.Species.createFromFlopId(i);
    //     if (species.moves.filter(move => move.speed >= 3).length === 4) {
    //         console.log(i, species.health, ...species.moves.map(move => move.speed));
    //     }
    // }

    objCharacterBoxer()
        .at(lvl.DummyMarker)
        .mixin(mxnCutscene, function* () {
            const playerFlopId = yield* DramaFlops.askFlop(range(999).map(() => Rng.float() < 30 / 1000));
            const enemyFlopId = yield* DramaFlops.askFlop(range(999).map(() => Rng.float() < 30 / 1000));

            const playerTrainer = new EsotericPokeEngine.Trainer(
                {
                    *coroChooseMove(moves) {
                        const index = yield* ask(
                            "What move to use?",
                            ...moves.map(move => move.isUsed ? null : printMove(move.data, "\n")),
                        );
                        return moves[index];
                    },
                },
                new EsotericPokeEngine.Animal(EsotericPokeData.Species.createFromFlopId(playerFlopId)),
            );

            const enemyTrainer = new EsotericPokeEngine.Trainer(
                {
                    *coroChooseMove(moves) {
                        return Rng.item(moves.filter(move => !move.isUsed));
                    },
                },
                new EsotericPokeEngine.Animal(EsotericPokeData.Species.createFromFlopId(enemyFlopId)),
            );

            function printName(entity: EsotericPokeEngine.Animal | EsotericPokeEngine.Trainer) {
                if (entity instanceof EsotericPokeEngine.Trainer) {
                    return entity === playerTrainer ? "PLAYER" : "ENEMY";
                }
                return entity === playerTrainer.animal ? "PLAYER" : "ENEMY";
            }

            const animalStatesObj = container(
                objAnimalState("PLAYER", playerTrainer.animal).at(20, 100),
                objAnimalState("ENEMY", enemyTrainer.animal).at(400, 100),
            )
                .show();

            const events: EsotericPokeEngine.Battle.EventHandler = {
                *handle(event) {
                    switch (event.kind) {
                        case "round_started":
                            return;
                        case "moves_chosen":
                            yield* show("The flops ready themselfzs.");
                            return;
                        case "moves_failed":
                            yield* show("The attacks miss!");
                            return;
                        case "round_ended":
                            return;
                        case "move_start":
                            yield* show(`${printName(event.actingAnimal)} attacks with ${event.move.name}!`);
                            return;
                        case "move_outcome":
                            yield* show(`${printName(event.targetAnimal)} takes ${event.damage} damage!`);
                            return;
                    }
                },
            };

            const { winningTrainer } = yield* EsotericPokeEngine.Battle.coroExecute({
                trainers: [playerTrainer, enemyTrainer],
                events,
            });

            yield* show(`${printName(winningTrainer)} wins!`);
            animalStatesObj.destroy();
        })
        .show();
}

function printMove(move: EsotericPokeData.Move, separator = " ") {
    return `${move.name}${separator}(${move.type} ${move.speed})`;
}

function objAnimalState(name: string, animal: EsotericPokeEngine.Animal) {
    return objText.Medium()
        .step(self =>
            self.text = `${name}
HP: ${animal.health} / ${animal.healthMax}
STANCE: ${animal.stanceType}
MOVES:
${
                animal.moves
                    .filter(move => !move.isUsed)
                    .map(move => `- ${printMove(move.data)}`)
                    .join("\n")
            }
`
        );
}
