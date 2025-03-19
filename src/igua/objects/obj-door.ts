import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear, nlerp } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { DramaMisc } from "../drama/drama-misc";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { GenerativeMusicUtils } from "../lib/generative-music-utils";
import { mxnInteract } from "../mixins/mxn-interact";
import { SceneChanger } from "../systems/scene-changer";

interface ObjDoorArgs {
    sceneName: string;
    checkpointName: string;
}

export function objDoor({ sceneName, checkpointName }: ObjDoorArgs) {
    let locked = false;

    const sceneChanger = SceneChanger.create({ sceneName, checkpointName });

    const openObj = Sprite.from(Tx.Door.NormalOpen);
    const maskObj0 = new Graphics().beginFill(0x000000).drawRect(0, 0, 34, 46);
    const maskObj1 = new Graphics().beginFill(0x000000).drawRect(0, 0, 34, 46);
    const maskObj2 = new Graphics().beginFill(0x000000).drawRect(0, 0, 34, 46);
    const lockedObj0 = Sprite.from(Tx.Door.NormalLockedLayer0).masked(maskObj0);
    const lockedObj1 = Sprite.from(Tx.Door.NormalLockedLayer1).masked(maskObj1);
    const lockedObj2 = Sprite.from(Tx.Door.NormalLockedLayer2).masked(maskObj2);

    function getTargetMaskY() {
        return locked ? 0 : 46;
    }

    function setMaskPositionToTarget() {
        const targetY = getTargetMaskY();
        maskObj0.y = targetY;
        maskObj1.y = targetY;
        maskObj2.y = targetY;
    }

    setMaskPositionToTarget();

    const obj = container(openObj, maskObj0, maskObj1, maskObj2, lockedObj0, lockedObj1, lockedObj2)
        .merge({
            get locked() {
                return locked;
            },
            set locked(value) {
                locked = value;
                setMaskPositionToTarget();
            },
            lock() {
                locked = true;
            },
            unlock() {
                locked = false;
            },
        })
        .mixin(mxnInteract, () => {
            if (obj.locked) {
                Cutscene.play(() => show("Closed."));
                return;
            }
            if (sceneChanger) {
                throw new EscapeTickerAndExecute(() => {
                    DramaMisc.departRoomViaDoor(null);
                    sceneChanger.changeScene();
                });
            }
        })
        .coro(function* (self) {
            while (true) {
                yield () => maskObj0.y !== getTargetMaskY();

                const tune = GenerativeMusicUtils.tune7(locked ? "minor" : "major");

                while (maskObj0.y !== getTargetMaskY()) {
                    const targetY = getTargetMaskY();
                    const rawNextY = approachLinear(maskObj0.y, targetY, 4);

                    // Snap to brick positions
                    const nextY = rawNextY === targetY ? targetY : (Math.round((rawNextY - 3) / 7) * 7 + 3);

                    const f = nlerp(1, 6, 1 - (Math.abs(nextY - targetY) / 46));

                    const isLocking = maskObj0.y > nextY;

                    const f0 = Math.max(1, 0.3 * f);
                    const f1 = Math.max(1, 0.65 * f);

                    const { value: rate } = tune.next();
                    if (rate) {
                        self.play(Rng.choose(Sfx.Impact.DoorLock0, Sfx.Impact.DoorLock1).rate(rate));
                    }

                    (isLocking ? maskObj0 : maskObj2).y = nextY;
                    yield sleepf(f1);
                    maskObj1.y = nextY;
                    yield sleepf(f1);
                    (isLocking ? maskObj2 : maskObj0).y = nextY;
                    yield sleepf(f0);
                }
            }
        });

    const seed = (sceneName.charCodeAt(sceneName.length - 1) || 0)
        + (checkpointName.charCodeAt(checkpointName.length - 1) || 0);
    if (seed % 2 === 0) {
        obj.flipH();
    }

    return obj;
}

export type ObjDoor = ReturnType<typeof objDoor>;
