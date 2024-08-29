import { DisplayObject, Rectangle } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { vnew } from "../../lib/math/vector-type";
import { merge } from "../../lib/object/merge";
import { Cutscene, Input, layers } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { MxnRpgStatus, mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgPlayer } from "../rpg/rpg-player";
import { RpgProgress } from "../rpg/rpg-progress";
import { RpgStatus } from "../rpg/rpg-status";
import { ObjIguanaLocomotive, ObjIguanaLocomotiveAutoFacingMode, objIguanaLocomotive } from "./obj-iguana-locomotive";
import { StepOrder } from "./step-order";
import { force } from "../mixins/mxn-physics";

const PlayerConsts = {
    // TODO probably not constants, probably derived from status
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    JumpSpeed: -3,
    Gravity: 0.1,
}

const filterVulnerableObjs = (obj: MxnRpgStatus) => obj.status.faction !== RpgFaction.Player;

function objPlayer(looks: IguanaLooks.Serializable) {
    const iguanaLocomotiveObj = objIguanaLocomotive(looks);

    const died = () => {}

    const effects: RpgStatus.Effects = merge(
        { died },
        layers.overlay.hud.healthBarObj.effects);

    const puppet = iguanaLocomotiveObj
        .mixin(mxnRpgStatus, { status: RpgPlayer.Model, effects, hurtboxes: [ iguanaLocomotiveObj ] })
        .merge({ get hasControl() { return !Cutscene.isPlaying; }, get walkingTopSpeed() { return RpgPlayer.WalkingTopSpeed; } })
        .step(() => {
            if (puppet.isBeingPiloted)
                return;
            const hasControl = puppet.hasControl;
            puppet.isMovingLeft = hasControl && Input.isDown('MoveLeft');
            puppet.isMovingRight = hasControl && Input.isDown('MoveRight');
            puppet.isDucking = hasControl && puppet.isOnGround && Input.isDown('Duck');
            
            if (hasControl && puppet.isOnGround && Input.justWentDown('Jump')) {
                puppet.speed.y = PlayerConsts.JumpSpeed;
            }
        })
        .step(() => {
            for (const instance of Instances(mxnRpgStatus, filterVulnerableObjs)) {
                const hurtbox = puppet.collidesOne(instance.hurtboxes);
                if (hurtbox) {
                    bounceIguanaOffObject(puppet, hurtbox);
                    instance.damage(RpgPlayer.MeleeAttack);
                }       
            }
        }, StepOrder.Physics + 1);

    puppet.autoFacingMode = ObjIguanaLocomotiveAutoFacingMode.CheckMoving;

    return puppet;
}

const bounceIguanaOffObject = function() {
    const hurtboxBounds = new Rectangle();
    const torsoBounds = new Rectangle();
    const vcenter = vnew();
    const vforce = vnew();

    return function bounceIguanaOffObject(iguana: ObjIguanaLocomotive, obj: DisplayObject) {
        obj.getBounds(true, hurtboxBounds);
        iguana.body.torso.getBounds(false, torsoBounds);

        const collidedWithFeet = Boolean(obj.collidesOne(iguana.feet.shapes));

        vcenter.at(torsoBounds.getCenter()).add(hurtboxBounds.getCenter(), -1).normalize();

        const pushx = Math.abs(vcenter.x) > 0.2 ? vcenter.x : 0;
        const pushy = collidedWithFeet ? (-1 - Math.abs(pushx)) : (vcenter.y > 0.5 ? vcenter.y : 0);

        vforce.at(pushx, pushy).normalize();

        const length = Math.max(RpgPlayer.BouncingMinSpeed, iguana.speed.vlength);
        iguana.speed.at(vforce).scale(length);

        let iter = 0;
        // TODO pretty arbitrary condition
        while (iter++ < 2 && iguana.collides(obj)) {
            if (force(iguana, vforce.scale(3)).stopped)
                break;
        }
    }
}()

export let playerObj: ReturnType<typeof objPlayer>;

export function createPlayerObj(looks: IguanaLooks.Serializable = RpgProgress.character.looks) {
    return playerObj = objPlayer(looks);
}