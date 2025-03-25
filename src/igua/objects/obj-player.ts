import { DisplayObject, Rectangle } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { interp } from "../../lib/game-engine/routines/interp";
import { vnew } from "../../lib/math/vector-type";
import { merge } from "../../lib/object/merge";
import { ZIndex } from "../core/scene/z-index";
import { Cutscene, DevKey, Input, layers, scene } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { force } from "../mixins/mxn-physics";
import { MxnRpgStatus, mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgPlayer } from "../rpg/rpg-player";
import { RpgProgress } from "../rpg/rpg-progress";
import { RpgStatus } from "../rpg/rpg-status";
import { CtxGate } from "./obj-gate";
import { ObjIguanaLocomotive, objIguanaLocomotive, ObjIguanaLocomotiveAutoFacingMode } from "./obj-iguana-locomotive";
import { ObjSign, objSign } from "./obj-sign";
import { StepOrder } from "./step-order";

const PlayerConsts = {
    // TODO probably not constants, probably derived from status
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    JumpSpeed: -3,
    JumpSpeedAtSpecialSign: -6,
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

    iguanaLocomotiveObj.mxnBallonable.setInitialBallons(RpgPlayer.status.conditions.helium.ballons);

    const died = () => {};

    // TODO truly wretched
    const effects: RpgStatus.Effects = merge(
        merge({ died }, iguanaLocomotiveObj.mxnBallonable.rpgStatusEffects),
        layers.overlay.hud.healthBarObj.effects,
    );

    const status: RpgStatus.Model = merge(
        { state: { ballonHealthMayDrain: false, isGuarding: false } satisfies RpgStatus.Model["state"] },
        RpgPlayer.status,
    );

    const puppet = iguanaLocomotiveObj
        .mixin(mxnRpgStatus, { status, effects, hurtboxes: [iguanaLocomotiveObj] })
        .mixin(mxnSparkling)
        .handles("moved", () => {
            if (CtxGate.value.isGateTransitionActive) {
                return;
            }

            status.state.ballonHealthMayDrain = !puppet.isOnGround;

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
            get hasControl() {
                // TODO I sometimes wonder if this belongs closer to the RPG layer
                return !Cutscene.isPlaying;
            },
            get walkingTopSpeed() {
                return RpgPlayer.motion.walkingTopSpeed;
            },
        })
        .step(() => {
            const ballonsCount = RpgProgress.character.status.conditions.helium.ballons.length;
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
            puppet.isDucking = hasControl && puppet.isOnGround && Input.isDown("Duck");
            status.state.isGuarding = puppet.isDucking;

            if (
                hasControl && !puppet.isOnGround && puppet.speed.y < PlayerConsts.VariableJumpSpeedMaximum
                && Input.isDown("Jump")
            ) {
                puppet.speed.y += PlayerConsts.VariableJumpDelta;
            }
            if (hasControl && puppet.isOnGround && Input.justWentDown("Jump")) {
                if (
                    RpgPlayer.equipmentAttributes.quirks.enablesHighJumpsAtSpecialSigns
                    && puppet.collidesOne(Instances(objSign, filterSpecialSignObjs))
                ) {
                    puppet.play(Sfx.Effect.JumpSpecial.rate(0.9, 1.1));
                    puppet.coro(function* () {
                        puppet.sparklesPerFrame = 2;
                        yield interp(puppet, "sparklesPerFrame").to(0).over(500);
                    });
                    puppet.speed.y = PlayerConsts.JumpSpeedAtSpecialSign;
                    RpgExperienceRewarder.jump.onJump(ballonsCount, true);
                }
                else {
                    puppet.speed.y = PlayerConsts.JumpSpeed;
                    RpgExperienceRewarder.jump.onJump(ballonsCount, false);
                }
            }
        })
        .step(() => {
            for (const instance of Instances(mxnRpgStatus, filterVulnerableObjs)) {
                const hurtbox = puppet.collidesOne(instance.hurtboxes);
                if (hurtbox) {
                    const collidedWithFeet = bounceIguanaOffObject(puppet, hurtbox);
                    const attack = collidedWithFeet ? RpgPlayer.meleeClawAttack : RpgPlayer.meleeAttack;
                    const result = instance.damage(attack, status);
                }
            }
        }, StepOrder.AfterPhysics)
        .zIndexed(ZIndex.PlayerEntities);

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

        const length = Math.max(RpgPlayer.motion.bouncingMinSpeed, iguana.speed.vlength);
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

export function createPlayerObj(looks: IguanaLooks.Serializable = RpgProgress.character.looks) {
    return playerObj = objPlayer(looks);
}
