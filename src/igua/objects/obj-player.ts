import { merge } from "../../lib/object/merge";
import { Cutscene, Input, layers } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { RpgPlayer } from "../rpg/rpg-player";
import { RpgProgress } from "../rpg/rpg-progress";
import { RpgStatus } from "../rpg/rpg-status";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

const PlayerConsts = {
    // TODO probably not constants, probably derived from status
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    JumpSpeed: -3,
    Gravity: 0.1,
}

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
        });

    return puppet;
}

export let playerObj: ReturnType<typeof objPlayer>;

export function createPlayerObj(looks: IguanaLooks.Serializable = RpgProgress.character.looks) {
    return playerObj = objPlayer(looks);
}