import { DisplayObject, Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { objDramaNameTag } from "../drama/objects/obj-drama-name-tag";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { objCharacterBattleMaster } from "../objects/characters/obj-character-battle-master";
import { objEsotericPokeOverlay } from "../objects/esoteric/obj-esoteric-poke-overlay";
import { EsotericPokeData } from "../objects/esoteric/poke/esoteric-poke-data";
import { EsotericPokeEngine } from "../objects/esoteric/poke/esoteric-poke-engine";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnOhioHallPoke() {
    const rpgFlag = {
        get currentRank() {
            return Rpg.flags.ohioHall.pokeBattleRank;
        },
        onWin() {
            Rpg.flags.ohioHall.pokeBattleRank = Math.min(5, Rpg.flags.ohioHall.pokeBattleRank + 2);
        },
        onLose() {
            Rpg.flags.ohioHall.pokeBattleRank = Math.max(0, Rpg.flags.ohioHall.pokeBattleRank - 1);
        },
        get isElligibleForReward() {
            return this.currentRank >= 5;
        },
    };

    const cosmHallOfDoors = Rpg.microcosms["Ohio.HallOfDoors"];

    const lvl = Lvl.OhioHallPoke();

    lvl.RankIndicatorGroup.children
        .forEach((obj, i) => obj.step(self => self.tint = rpgFlag.currentRank > i ? 0xffffff : 0x3b3b3b));

    const playerBattleObj = lvl.PlayerPedestal;
    const enemyBattleObj = lvl.EnemyPedestal;

    const battleObjs = [playerBattleObj, enemyBattleObj];

    battleObjs
        .forEach(obj => obj.objWeightedPedestal.askFlopConfig.showPokeSpeciesStatistics = true);

    const state = {
        isBattling: false,
    };

    lvl.LeftLightBeam
        .mixin(mxnLightPredicate, () => state.isBattling);
    lvl.RightLightBeam
        .mixin(mxnLightPredicate, () => state.isBattling);
    lvl.CenterLightBeam
        .mixin(
            mxnLightPredicate,
            () =>
                !state.isBattling
                && battleObjs.every(obj => obj.rpgWeightedPedestal.isSufficientlyWeighted),
        );

    const announcerObj = objCharacterBattleMaster();

    lvl.OpponentNpc
        .mixin(mxnCutscene, function* () {
            if (!enemyBattleObj.rpgWeightedPedestal.isSufficientlyWeighted) {
                yield* show(
                    "Psst... Can you spot me a Flop? I really want to battle.",
                    "Just go ahead and place it on the pedestal on my side of the arena.",
                );
                return;
            }

            if (!playerBattleObj.rpgWeightedPedestal.isSufficientlyWeighted) {
                yield* show("Once you add a Flop to your pedestal, we can battle!");
                return;
            }

            yield* show("Arrr! I'm gonna wipe the floors with you!");
        });

    announcerObj
        .at(lvl.DummyMarker)
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "Welcome to the arena! What can I do for you?",
                "Let's battle!",
                "Want my prize!",
                "Get me out of here!",
                "Teach me about battle.",
                "Nevermind.",
            );

            if (result === 1) {
                if (!rpgFlag.isElligibleForReward) {
                    yield* show("Sorry you are not elligible for a reward.", "You need a rank of at least 5.");
                    return;
                }

                yield* show("Your prize?! Yes, you are rank 5.", "Here you go!");
                yield* DramaHallOfDoors.complete(cosmHallOfDoors, 2);
                return;
            }
            else if (result === 2) {
                yield* show("Okay! Your rank in the arena will be unaffected!");
                yield* DramaHallOfDoors.returnToHall(cosmHallOfDoors);
                return;
            }
            else if (result === 3) {
                // TODO
                return;
            }
            else if (result === 4) {
                yield* show("Ok!");
                return;
            }

            const playerFlopId = playerBattleObj.rpgWeightedPedestal.list[0];
            const enemyFlopId = enemyBattleObj.rpgWeightedPedestal.list[0];

            if (!playerFlopId || !enemyFlopId) {
                yield* show("Please place a flop on both pedestals so that we can battle!!");
                return;
            }

            state.isBattling = true;

            yield* playerObj.walkTo(lvl.PlayerBattleMarker.x);
            playerObj.auto.facing = 1;

            const playerTrainer = new EsotericPokeEngine.Trainer(
                {
                    *coroChooseMove(moves) {
                        const index = yield* ask(
                            `What move will you use, ${Rpg.character.attributes.names.current}?`,
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
                objAnimalState(lvl.OpponentNpc, enemyTrainer.animal).at(400, 0),
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
                battleObjs.forEach(obj => obj.objWeightedPedestal.destroy());
                yield sleep(1000);
                yield* show("Victor and opponent have ascended to the ChristianHeaven.");
                rpgFlag.onWin();
            }
            else {
                playerBattleObj.objWeightedPedestal.destroy();
                yield sleep(1000);
                yield* show("Loser has been expelled.");
                rpgFlag.onLose();
            }

            state.isBattling = false;
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

function mxnLightPredicate(obj: DisplayObject, predicate: () => boolean) {
    obj.alpha = 0;
    return obj
        .coro(function* (self) {
            while (true) {
                yield predicate;
                yield interp(self, "alpha").steps(3).to(0.33).over(750);
                yield () => !predicate();
                yield interp(self, "alpha").steps(3).to(0).over(500);
            }
        });
}
