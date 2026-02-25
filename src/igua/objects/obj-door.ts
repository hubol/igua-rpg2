import { Graphics, Sprite, Texture } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear, nlerp } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { IguaCutscene } from "../core/igua-cutscene";
import { DramaMisc } from "../drama/drama-misc";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { GenerativeMusicUtils } from "../lib/generative-music-utils";
import { mxnInteract } from "../mixins/mxn-interact";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { SceneChanger } from "../systems/scene-changer";

interface ObjDoorArgs {
    sceneName: string;
    checkpointName: string;
}

export function objDoor({ sceneName, checkpointName }: ObjDoorArgs) {
    let locked = false;

    const sceneChanger = SceneChanger.create({ sceneName, checkpointName });

    const openObj = Sprite.from(Tx.Door.Normal.Open);
    const maskObj0 = new Graphics().beginFill(0x000000).drawRect(0, 0, 34, 46);
    const maskObj1 = new Graphics().beginFill(0x000000).drawRect(0, 0, 34, 46);
    const maskObj2 = new Graphics().beginFill(0x000000).drawRect(0, 0, 34, 46);
    const lockedObj0 = Sprite.from(Tx.Door.Normal.LockedLayer0).masked(maskObj0);
    const lockedObj1 = Sprite.from(Tx.Door.Normal.LockedLayer1).masked(maskObj1);
    const lockedObj2 = Sprite.from(Tx.Door.Normal.LockedLayer2).masked(maskObj2);

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

    const api = {
        lockedMessage: "Closed.",
        lockedCutscene: Null<IguaCutscene.CutsceneFn>(),
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
        get checkpointName() {
            return sceneChanger?.checkpointName ?? null;
        },
        set checkpointName(value) {
            if (sceneChanger && value) {
                sceneChanger.checkpointName = value;
            }
        },
        set style(style: keyof typeof Tx["Door"]) {
            lockedObj0.texture = Tx.Door[style].LockedLayer0;
            lockedObj1.texture = Tx.Door[style].LockedLayer1;
            lockedObj2.texture = Tx.Door[style].LockedLayer2;
            openObj.texture = Tx.Door[style].Open;
        },
    };

    const obj = container(openObj, maskObj0, maskObj1, maskObj2, lockedObj0, lockedObj1, lockedObj2)
        .mixin(mxnSpeaker, { name: "Door", colorPrimary: 0x342716, colorSecondary: 0x2C251D })
        .merge({ objDoor: api })
        .mixin(mxnInteract, () => {
            if (api.locked) {
                Cutscene.play(
                    api.lockedCutscene
                        ? api.lockedCutscene
                        : () => show(api.lockedMessage),
                    { speaker: obj },
                );
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
