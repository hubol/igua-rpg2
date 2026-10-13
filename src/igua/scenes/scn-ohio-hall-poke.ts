import { DisplayObject, Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { objDramaNameTag } from "../drama/objects/obj-drama-name-tag";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { objCharacterBoxer } from "../objects/characters/obj-character-boxer";
import { objEsotericPokeOverlay } from "../objects/esoteric/obj-esoteric-poke-overlay";
import { EsotericPokeData } from "../objects/esoteric/poke/esoteric-poke-data";
import { EsotericPokeEngine } from "../objects/esoteric/poke/esoteric-poke-engine";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnOhioHallPoke() {
    const lvl = Lvl.OhioHallPoke();

    const announcerObj = objCharacterBoxer();

    announcerObj
        .at(lvl.DummyMarker)
        .mixin(mxnCutscene, function* () {
            const playerBattleObj = lvl.PlayerPedestal;
            const enemyBattleObj = lvl.EnemyPedestal;

            const playerFlopId = playerBattleObj.rpgWeightedPedestal.list[0];
            const enemyFlopId = enemyBattleObj.rpgWeightedPedestal.list[0];

            if (!playerFlopId || !enemyFlopId) {
                yield* show("Please place a flop on both pedestals so that we can battle!!");
                return;
            }

            const playerTrainer = new EsotericPokeEngine.Trainer(
                {
                    *coroChooseMove(moves) {
                        const index = yield* ask(
                            "What move to use?",
                            ...moves.map(move => move.isUsed ? null : objEsotericPokeOverlay.txtMove(move.data, "\n")),
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
                    return entity === playerTrainer ? Rpg.character.attributes.names.current : "ENEMY";
                }
                return entity === playerTrainer.animal ? `${Rpg.character.attributes.names.current}'s Flop` : "ENEMY";
            }

            const battleOverlayObj = container(
                objAnimalState(playerObj, playerTrainer.animal).at(20, 0),
                objAnimalState(announcerObj, enemyTrainer.animal).at(400, 0),
                Sprite.from(Tx.Esoteric.Poke.TypeGrid).at(175, 132),
            )
                .mixin(mxnHudModifiers.mxnHideStatus)
                .at(0, 20)
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
                            yield* Coro.all([playerBattleObj, enemyBattleObj].map(drama.hop));
                            yield* show("The attacks miss!");
                            return;
                        case "round_ended":
                            return;
                        case "move_start":
                            yield* show(`${printName(event.actingAnimal)} attacks with ${event.move.name}!`);
                            const actingObj = event.actingAnimal === playerTrainer.animal
                                ? playerBattleObj
                                : enemyBattleObj;
                            yield* drama.attack(
                                actingObj,
                                actingObj === playerBattleObj ? enemyBattleObj : playerBattleObj,
                            );
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
            battleOverlayObj.destroy();

            if (winningTrainer === playerTrainer) {
                playerBattleObj.objWeightedPedestal.destroy();
                enemyBattleObj.objWeightedPedestal.destroy();
                yield sleep(1000);
                yield* show("Victor and opponent have ascended to the ChristianHeaven.");
            }
            else {
                playerBattleObj.objWeightedPedestal.destroy();
                yield sleep(1000);
                yield* show("Loser has been expelled.");
            }
        })
        .show();
}

function objAnimalState(speakerObj: DisplayObject, animal: EsotericPokeEngine.Animal) {
    return container(
        objEsotericPokeOverlay.objStatistics.objFromAnimal(animal)
            .at(0, 14),
        objDramaNameTag(speakerObj),
    );
}

const drama = {
    *hop(obj: DisplayObject) {
        // TODO sfx
        yield interpvr(obj).factor(factor.sine).translate(0, -20).over(333);
        yield interpvr(obj).factor(factor.sine.inverted).translate(0, 20).over(200);
    },
    *attack(attackerObj: DisplayObject, targetObj: DisplayObject) {
        // TODO sfx
        const dx = Math.sign(targetObj.x - attackerObj.x);
        yield interpvr(attackerObj).factor(factor.sine).translate(dx * 50, 0).over(333);
        for (let i = 0; i < 4; i++) {
            targetObj.visible = !targetObj.visible;
            yield sleep(100);
        }
        yield interpvr(attackerObj).factor(factor.sine).translate(dx * -50, 0).over(333);
    },
};
