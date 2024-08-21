import { DisplayObject } from "pixi.js";
import { MxnPhysics, PhysicsFaction } from "./mxn-physics";
import { Vector } from "../../lib/math/vector-type";

// TODO feels weird
export enum ReceivesPhysicsFaction {
    Player = PhysicsFaction.Player,
    Enemy = PhysicsFaction.Enemy,
    Any = Player | Enemy,
}

interface CollideEvent {
    obj: MxnPhysics;
    previousSpeed: Vector;
    previousOnGround: boolean;
}

interface MxnPhysicsCollideableArgs {
    receivesPhysicsFaction: ReceivesPhysicsFaction;
    onPhysicsCollision: (event: CollideEvent) => void;
}

export function mxnPhysicsCollideable(obj: DisplayObject, args: MxnPhysicsCollideableArgs) {
    return obj.track(mxnPhysicsCollideable)
    .merge(args);
}