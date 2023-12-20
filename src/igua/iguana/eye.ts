import { Graphics, Rectangle, Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { vnew } from "../../lib/math/vector-type";
import { Rng } from "../../lib/math/rng";
import { objSpriteCopy } from "./copy-sprite";

const r = new Rectangle();

export function objEye(
        scleraSpr: Sprite,
        pupilSpr: Sprite,
        eyelidTint: number,
        eyelidPolar: number) {
    const scleraTx = scleraSpr.texture;

    const mask = objSpriteCopy(scleraSpr);

    const b = mask.getBounds(false, r);
    
    const pivotSign = eyelidPolar < 0 ? 1 : 0;

    const eyelid = new Graphics().beginFill(eyelidTint).drawRect(0, 0, scleraTx.width, scleraTx.height);
    eyelid.pivot.y = 2 * pivotSign * scleraTx.height;
    eyelid.at(b.x, b.y);

    const c = container(mask, scleraSpr, pupilSpr, eyelid)
        .merge({ closed: 0, look: vnew() })
        .step(() => {
            eyelid.scale.y = c.closed * pivotSign;
        })

    c.mask = mask;

    return c;
}

type ObjEye = ReturnType<typeof objEye>;

export function objEyes(left: ObjEye, right: ObjEye) {
    const c = container(left, right)
        .merge({ stepsUntilBlink: -1, closed: -1, eyelidMotion: 0, left, right })
        .step(() => {
            if (c.eyelidMotion === 0 && c.stepsUntilBlink > 0) {
                if (--c.stepsUntilBlink === 0) {
                    c.eyelidMotion = 1;
                    c.stepsUntilBlink = Rng.int(30, 180);
                }
            }

            if (c.closed >= 0) {
                left.closed = c.closed;
                right.closed = c.closed;
            }

            if (c.eyelidMotion !== 0) {
                c.closed = Math.max(0, Math.min(1, c.closed + c.eyelidMotion * 0.2));
                if (c.closed === 1 && c.eyelidMotion > 0)
                    c.eyelidMotion = -1;
                if (c.closed === 0 && c.eyelidMotion < 0)
                    c.eyelidMotion = 0;
            }
        });

    return c;
}