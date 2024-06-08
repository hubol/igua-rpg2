import { approachLinear } from "../../lib/math/number";
import { Cutscene, Input } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnPhysics } from "../mixins/mxn-physics";
import { mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { hudObj } from "./obj-hud";

const PlayerConsts = {
    // TODO probably not constants, probably derived from status
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    WalkingTopSpeed: 2.5,
    JumpSpeed: -3,
    Gravity: 0.1,
}

function objPlayer(looks: IguanaLooks.Serializable) {
    let lastNonZeroSpeedXSign = 0;

    const puppet = objIguanaPuppet(looks)
        // TODO from global state
        .mixin(mxnRpgStatus, {
            health: 60,
            invulnerable: 0,
            maxHealth: 60,
            poison: {
                level: 0,
                max: 100,
                value: 0,
            }
        }, hudObj.healthBarObj.effects)
        // TODO some of this can be extracted to a "objIguanaLocomotivePuppet" ?
        .mixin(mxnPhysics, { gravity: PlayerConsts.Gravity, physicsRadius: 7, physicsOffset: [0, -9], debug: false, onMove: (event) => {
            if (event.hitGround && !event.previousOnGround && event.previousSpeed.y > 1.2)
                puppet.landingFrames = 10;
        } })
        .merge({ get hasControl() { return !Cutscene.isPlaying; } })
        .step(() => {
            const hasControl = puppet.hasControl;
            const moveLeft = hasControl && Input.isDown('MoveLeft');
            const moveRight = hasControl && Input.isDown('MoveRight');
            const duck = hasControl && Input.isDown('Duck');

            // TODO probably expose so that attackers can see this?
            const isDucking = duck && puppet.isOnGround;

            // TODO probably things beyond here should be abstracted into "objLocomotiveIguana"
            if ((moveLeft && moveRight) || (!moveLeft && !moveRight) || isDucking) {
                puppet.speed.x = approachLinear(puppet.speed.x, 0, PlayerConsts.WalkingDeceleration);
            }
            else if (moveLeft)
                puppet.speed.x = Math.max(puppet.speed.x - PlayerConsts.WalkingDeceleration, -PlayerConsts.WalkingTopSpeed);
            else if (moveRight)
                puppet.speed.x = Math.min(puppet.speed.x + PlayerConsts.WalkingDeceleration, PlayerConsts.WalkingTopSpeed);

            if (puppet.isOnGround && hasControl && Input.justWentDown('Jump')) {
                puppet.speed.y = PlayerConsts.JumpSpeed;
            }

            puppet.isAirborne = !puppet.isOnGround;

            puppet.airborneDirectionY = approachLinear(puppet.airborneDirectionY, -Math.sign(puppet.speed.y), puppet.speed.y > 0 ? 0.075 : 0.25);

            if (puppet.speed.x !== 0) {
                puppet.pedometer += Math.abs(puppet.speed.x * 0.05);
            }
            else if (puppet.gait === 0)
                puppet.pedometer = 0;

            puppet.gait = approachLinear(puppet.gait, Math.min(puppet.isAirborne ? 0 : Math.abs(puppet.speed.x), 1), 0.15);

            if (puppet.speed.x !== 0) {
                lastNonZeroSpeedXSign = Math.sign(puppet.speed.x);
            }

            puppet.facing = approachLinear(
                puppet.facing,
                Math.sign(puppet.speed.x) || lastNonZeroSpeedXSign || Math.sign(puppet.facing),
                0.1);

            puppet.ducking = approachLinear(puppet.ducking, isDucking ? 1 : 0, 0.075);
        });

    return puppet;
}

export let playerObj: ReturnType<typeof objPlayer>;

export function createPlayerObj(looks: IguanaLooks.Serializable) {
    return playerObj = objPlayer(looks);
}