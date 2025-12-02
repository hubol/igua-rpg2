import { DisplayObject, Rectangle } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { vnew } from "../../lib/math/vector-type";
import { merge } from "../../lib/object/merge";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataRespawnConfiguration } from "../data/data-respawn-configuration";
import { Cutscene, DevKey, Input, layers, scene } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { force } from "../mixins/mxn-physics";
import { MxnRpgStatus, mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Rpg } from "../rpg/rpg";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgStatus } from "../rpg/rpg-status";
import { objFxEnemyDefeat } from "./effects/obj-fx-enemy-defeat";
import { objFxPlayerJumpComboDust } from "./effects/obj-fx-player-jump-combo-dust";
import { objFxSuperDust } from "./effects/obj-fx-super-dust";
import { CtxGate } from "./obj-gate";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "./obj-iguana-locomotive";
import { objIguanaNpc } from "./obj-iguana-npc";
import { ObjSign, objSign } from "./obj-sign";
import { StepOrder } from "./step-order";

const PlayerConsts = {
    // TODO probably not constants, probably derived from status
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    JumpSpeed: -3,
    VariableJumpSpeedMaximum: -1.5,
    VariableJumpDelta: -0.095,
    Gravity: 0.15,
    TerminalVelocity: 20,
    BallonLevelModifiers: {
        Gravity: {
            Delta: -0.01,
            Minimum: 0.1,
        },
        TerminalVelocity: {
            Base: 6,
            Delta: -1.5,
            Minimum: 2,
        },
    },
};

function getBallonPhysicsLevel(ballonsCount: number) {
    if (scene.isWorldMap) {
        return 0;
    }

    let level = 0;
    let countForNextLevel = 1;

    while (ballonsCount > 0) {
        if (ballonsCount >= countForNextLevel) {
            level += 1;
            ballonsCount -= countForNextLevel;
            countForNextLevel += 1;
        }
        else {
            level += ballonsCount / countForNextLevel;
            break;
        }
    }

    return level;
}

const filterVulnerableObjs = (obj: MxnRpgStatus) => obj.status.faction !== RpgFaction.Player;
const filterSpecialSignObjs = (obj: ObjSign) => obj.isSpecial;

function objPlayer(looks: IguanaLooks.Serializable) {
    const iguanaLocomotiveObj = objIguanaLocomotive(looks);
    iguanaLocomotiveObj.snapToGround = !scene.isWorldMap;

    iguanaLocomotiveObj.mxnBallonable.setInitialBallons(Rpg.character.status.conditions.helium.ballons);

    const onDied = () => {
        Jukebox.stop();

        objFxEnemyDefeat({ map: [looks.head.color, looks.head.crest.color, looks.body.color] })
            .at(puppet)
            .show();

        playerAliveObj.destroy();

        puppet
            .step(() => {
                puppet.physicsEnabled = false;
                puppet.gravity = 0;
                puppet.speed.at(0, 0);
            }, StepOrder.Physics - 1)
            .step(() => {
                puppet.visible = false;
                puppet.dripsPerFrame = 0;
            }, StepOrder.BeforeCamera - 1);

        Cutscene.play(function* () {
            iguanaLocomotiveObj.mxnBallonable.releaseBallons();
            Rpg.character.die();
            yield sleep(4000);
            Rpg.character.revive();
            layers.recreateOverlay();
            DataRespawnConfiguration.getSceneChanger(Rpg.character.attributes.respawnConfiguration).changeScene();
        }, { requiredPlayerIsAlive: false });
    };

    // TODO truly wretched
    const effects: RpgStatus.Effects = merge(
        merge({ died: onDied }, iguanaLocomotiveObj.mxnBallonable.rpgStatusEffects),
        layers.overlay.hud.healthBarObj.effects,
    );

    const status = Rpg.character.status;

    let stepsSinceOffGround = 0;
    let stepsSinceJumpJustWentDown = 100;
    let landedThenJumpedHorizontalSpeedBoostUnit = 0;

    function getWalkingTopSpeed() {
        let speed = 2.5 * Math.max(0, 1 + Rpg.character.buffs.motion.walk.topSpeedIncreaseFactor / 100);
        speed += 0.75 * Math.min(1, Rpg.character.status.conditions.poison.level);
        speed += 0.5 * Math.max(0, Rpg.character.status.conditions.poison.level - 1);
        return speed + landedThenJumpedHorizontalSpeedBoostUnit * 2;
    }

    const puppet = iguanaLocomotiveObj
        .mixin(mxnRpgStatus, { status, effects, hurtboxes: [iguanaLocomotiveObj] })
        .mixin(mxnSparkling)
        .mixin(mxnSpeaker, { name: "You", ...objIguanaNpc.getSpeakerColors(looks) })
        .handles("moved", () => {
            if (CtxGate.value.isGateTransitionActive) {
                return;
            }

            status.state.ballonHealthMayDrain = !scene.isWorldMap && !puppet.isOnGround;

            const xPrevious = puppet.x;
            puppet.x = Math.max(24, Math.min(puppet.x, scene.level.width - 24));
            if (puppet.x !== xPrevious) {
                puppet.speed.x = 0;
                puppet.pedometer = 0;
                puppet.gait = 0;
            }
        })
        .handles("damaged", (_, result) => {
            if (!result.rejected && result.damaged) {
                // TODO different sound effect for ducked/defended damage?
                Sfx.Impact.VsPlayerPhysical.play();
            }
        })
        .merge({
            get canInteract() {
                // TODO Same--I sometimes wonder if this belongs closer to the RPG layer
                return this.hasControl && !layers.overlay.inventory.isOpen;
            },
            get hasControl() {
                // TODO I sometimes wonder if this belongs closer to the RPG layer
                return !Cutscene.isPlaying;
            },
            get walkingTopSpeed() {
                return getWalkingTopSpeed();
            },
        })
        .zIndexed(ZIndex.PlayerEntities);

    const playerAliveObj = container()
        .step(() => {
            if (puppet.isOnGround) {
                stepsSinceOffGround++;
            }
            else {
                stepsSinceOffGround = 0;
            }

            stepsSinceJumpJustWentDown++;

            landedThenJumpedHorizontalSpeedBoostUnit = approachLinear(
                landedThenJumpedHorizontalSpeedBoostUnit,
                0,
                0.02,
            );

            const ballonsCount = Rpg.character.status.conditions.helium.ballons.length;
            const ballonPhysicsLevel = getBallonPhysicsLevel(ballonsCount);

            puppet.terminalVelocity = Math.max(
                (ballonPhysicsLevel === 0
                    ? PlayerConsts.TerminalVelocity
                    : PlayerConsts.BallonLevelModifiers.TerminalVelocity.Base)
                    + PlayerConsts.BallonLevelModifiers.TerminalVelocity.Delta * ballonPhysicsLevel,
                PlayerConsts.BallonLevelModifiers.TerminalVelocity.Minimum,
            );

            puppet.gravity = Math.max(
                PlayerConsts.Gravity + PlayerConsts.BallonLevelModifiers.Gravity.Delta * ballonPhysicsLevel,
                PlayerConsts.BallonLevelModifiers.Gravity.Minimum,
            );

            if (puppet.isBeingPiloted) {
                return;
            }

            if (DevKey.justWentDown("KeyB")) {
                RpgStatus.Methods.createBallon(puppet.status, puppet.effects);
            }

            const hasControl = puppet.hasControl;
            puppet.isMovingLeft = hasControl && Input.isDown("MoveLeft");
            puppet.isMovingRight = hasControl && Input.isDown("MoveRight");
            puppet.isMovingUp = hasControl && scene.isWorldMap && Input.isDown("WorldMap_MoveUp");
            puppet.isMovingDown = hasControl && scene.isWorldMap && Input.isDown("WorldMap_MoveDown");
            puppet.isDucking = hasControl && puppet.isOnGround && !scene.isWorldMap && Input.isDown("Duck");
            status.state.isGuarding = puppet.isDucking;

            if (
                hasControl && !puppet.isOnGround && puppet.speed.y < PlayerConsts.VariableJumpSpeedMaximum
                && !scene.isWorldMap
                && Input.isDown("Jump")
            ) {
                puppet.speed.y += PlayerConsts.VariableJumpDelta;
            }

            if (hasControl && !scene.isWorldMap && Input.justWentDown("Jump")) {
                stepsSinceJumpJustWentDown = 0;
            }

            if (hasControl && puppet.isOnGround && stepsSinceJumpJustWentDown < 6) {
                stepsSinceJumpJustWentDown = 100;

                const specialBonus = Rpg.character.buffs.motion.jump.bonusAtSpecialSigns;

                if (
                    specialBonus > 0
                    && puppet.collidesOne(Instances(objSign, filterSpecialSignObjs))
                ) {
                    puppet.play(Sfx.Effect.JumpSpecial.rate(0.9, 1.1));
                    puppet.coro(function* () {
                        puppet.sparklesPerFrame = 2;
                        yield interp(puppet, "sparklesPerFrame").to(0).over(500);
                    });
                    puppet.speed.y = PlayerConsts.JumpSpeed - specialBonus;
                    // TODO passing these in feels counterintuitive
                    Rpg.experience.reward.jump.onJump(ballonsCount, specialBonus * 2);
                }
                else {
                    puppet.speed.y = PlayerConsts.JumpSpeed;
                    Rpg.experience.reward.jump.onJump(ballonsCount, 0);
                }

                if (stepsSinceOffGround < 6 && (puppet.isMovingLeft || puppet.isMovingRight)) {
                    puppet.play(Sfx.Iguana.JumpCombo.rate(0.975, 1.025));
                    objFxPlayerJumpComboDust().at(puppet.x + Math.sign(puppet.facing) * -4, puppet.y).scaled(
                        -Math.sign(puppet.facing),
                        1,
                    ).show();
                    puppet.speed.x += Math.sign(puppet.facing) * 2;
                    landedThenJumpedHorizontalSpeedBoostUnit = 1;
                }
            }
        })
        .step(() => {
            for (const instance of Instances(mxnRpgStatus, filterVulnerableObjs)) {
                const hurtbox = puppet.collidesOne(instance.hurtboxes);
                if (hurtbox) {
                    const collidedWithFeet = bounceIguanaOffObject(puppet, hurtbox);
                    let attack = collidedWithFeet
                        ? Rpg.character.meleeClawAttack
                        : Rpg.character.meleeFaceAttack;

                    if (attack === Rpg.character.meleeClawAttack && stepsSinceJumpJustWentDown < 6) {
                        attack = Rpg.character.meleeClawWellTimedAttack;
                    }

                    const result = instance.damage(attack, status);

                    if (
                        attack === Rpg.character.meleeClawWellTimedAttack && (!result.rejected || !result.invulnerable)
                    ) {
                        Rpg.experience.reward.combat.onPerfectClawAttack(
                            Rpg.character.buffs.combat.melee.clawAttack.perfect.combatExperience,
                        );
                        puppet.play(Sfx.Iguana.TimedClawAttack.rate(0.975, 1.025));
                        objFxSuperDust().at(playerObj).zIndexed(ZIndex.CharacterEntities).show();
                        playerObj.landingFrames = 10;

                        landedThenJumpedHorizontalSpeedBoostUnit = 1;
                    }
                }
            }
        }, StepOrder.AfterPhysics)
        .show(puppet);

    puppet.auto.facingMode = "check_moving";

    return puppet;
}

const bounceIguanaOffObject = function () {
    const hurtboxBounds = new Rectangle();
    const torsoBounds = new Rectangle();
    const vcenter = vnew();
    const vforce = vnew();

    return function bounceIguanaOffObject (iguana: ObjIguanaLocomotive, obj: DisplayObject) {
        obj.getBounds(true, hurtboxBounds);
        iguana.body.torso.getBounds(false, torsoBounds);

        const collidedWithFeet = Boolean(obj.collidesOne(iguana.feet.shapes));

        vcenter.at(torsoBounds.getCenter()).add(hurtboxBounds.getCenter(), -1).normalize();

        const pushx = Math.abs(vcenter.x) > 0.2 ? vcenter.x : 0;
        const pushy = collidedWithFeet ? (-1 - Math.abs(pushx)) : (vcenter.y > 0.5 ? vcenter.y : 0);

        vforce.at(pushx, pushy).normalize();

        // Punish for attacking with your face instead of feet
        vforce.x *= 1.35;

        const length = Rpg.character.motion.bouncingMinSpeed;
        iguana.speed.at(vforce).scale(length);

        let iter = 0;
        // TODO pretty arbitrary condition
        while (iter++ < 2 && iguana.collides(obj)) {
            if (force(iguana, vforce.scale(3)).stopped) {
                break;
            }
        }

        return collidedWithFeet;
    };
}();

type ObjPlayer = ReturnType<typeof objPlayer>;

export function isPlayerObj(obj: DisplayObject): obj is ObjPlayer {
    return obj === playerObj;
}

export let playerObj: ObjPlayer;

export function createPlayerObj(looks: IguanaLooks.Serializable = Rpg.character.looks) {
    return playerObj = objPlayer(looks);
}
