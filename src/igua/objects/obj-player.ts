import { approachLinear } from "../../lib/math/number";
import { vnew } from "../../lib/math/vector-type";
import { Input } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";

const PlayerConsts = {
    // TODO probably not constants, probably derived from status
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    WalkingTopSpeed: 2,
}

export function objPlayer(looks: IguanaLooks.Serializable) {
    let lastNonZeroSpeedXSign = 0;

    const puppet = objIguanaPuppet(looks)
        .merge({ speed: vnew(), isOnGround: true }) // TODO probably from some physics engine base
        .step(() => {
            const leftDown = Input.isDown('MoveLeft');
            const rightDown = Input.isDown('MoveRight');

            if ((leftDown && rightDown) || (!leftDown && !rightDown)) {
                puppet.speed.x = approachLinear(puppet.speed.x, 0, PlayerConsts.WalkingDeceleration);
            }
            else if (leftDown)
                puppet.speed.x = Math.max(puppet.speed.x - PlayerConsts.WalkingDeceleration, -PlayerConsts.WalkingTopSpeed);
            else if (rightDown)
                puppet.speed.x = Math.min(puppet.speed.x + PlayerConsts.WalkingDeceleration, PlayerConsts.WalkingTopSpeed);

            if (puppet.speed.x !== 0) {
                puppet.pedometer += Math.abs(puppet.speed.x * 0.05);
            }
            else if (puppet.gait === 0)
                puppet.pedometer = 0;

            puppet.gait = approachLinear(puppet.gait, Math.min(Math.abs(puppet.speed.x), 1), 0.15);

            if (puppet.speed.x !== 0) {
                lastNonZeroSpeedXSign = Math.sign(puppet.speed.x);
            }

            puppet.facing = approachLinear(
                puppet.facing,
                Math.sign(puppet.speed.x) || lastNonZeroSpeedXSign || Math.sign(puppet.facing),
                Math.max(Math.min(Math.abs(puppet.speed.x * 0.05), 0.5), 0.1))
        })
        .step(() => {
            puppet.add(puppet.speed);
        });

    return puppet;
}