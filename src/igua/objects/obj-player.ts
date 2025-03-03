import { DisplayObject, Rectangle } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { interp } from "../../lib/game-engine/routines/interp";
import { vnew } from "../../lib/math/vector-type";
import { merge } from "../../lib/object/merge";
import { ZIndex } from "../core/scene/z-index";
import { Cutscene, Input, layers, scene } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { force } from "../mixins/mxn-physics";
import { MxnRpgStatus, mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSparkling } from "../mixins/mxn-sparkling";
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
};

const filterVulnerableObjs = (obj: MxnRpgStatus) => obj.status.faction !== RpgFaction.Player;
const filterSpecialSignObjs = (obj: ObjSign) => obj.isSpecial;

function objPlayer(looks: IguanaLooks.Serializable) {
    const iguanaLocomotiveObj = objIguanaLocomotive(looks);
    iguanaLocomotiveObj.gravity = PlayerConsts.Gravity;

    const died = () => {};

    const effects: RpgStatus.Effects = merge(
        { died },
        layers.overlay.hud.healthBarObj.effects,
    );

    const puppet = iguanaLocomotiveObj
        .mixin(mxnRpgStatus, { status: RpgPlayer.status, effects, hurtboxes: [iguanaLocomotiveObj] })
        .mixin(mxnSparkling)
        .handles("moved", () => {
            if (CtxGate.value.isGateTransitionActive) {
                return;
            }

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
            if (puppet.isBeingPiloted) {
                return;
            }
            const hasControl = puppet.hasControl;
            puppet.isMovingLeft = hasControl && Input.isDown("MoveLeft");
            puppet.isMovingRight = hasControl && Input.isDown("MoveRight");
            puppet.isDucking = hasControl && puppet.isOnGround && Input.isDown("Duck");
            RpgPlayer.status.isGuarding = puppet.isDucking;

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
                    // TODO sfx for special jump
                    puppet.coro(function* () {
                        puppet.sparklesPerFrame = 2;
                        yield interp(puppet, "sparklesPerFrame").to(0).over(500);
                    });
                    puppet.speed.y = PlayerConsts.JumpSpeedAtSpecialSign;
                }
                else {
                    puppet.speed.y = PlayerConsts.JumpSpeed;
                }
            }
        })
        .step(() => {
            for (const instance of Instances(mxnRpgStatus, filterVulnerableObjs)) {
                const hurtbox = puppet.collidesOne(instance.hurtboxes);
                if (hurtbox) {
                    const collidedWithFeet = bounceIguanaOffObject(puppet, hurtbox);
                    const attack = collidedWithFeet ? RpgPlayer.meleeClawAttack : RpgPlayer.meleeAttack;
                    const result = instance.damage(attack, RpgPlayer.status);
                }
            }
        }, StepOrder.Physics + 1)
        .zIndexed(ZIndex.PlayerEntities);

    puppet.auto.facingMode = ObjIguanaLocomotiveAutoFacingMode.CheckMoving;

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
