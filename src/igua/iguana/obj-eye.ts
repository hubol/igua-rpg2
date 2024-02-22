import { Graphics, Rectangle, Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { vnew } from "../../lib/math/vector-type";
import { Rng } from "../../lib/math/rng";
import { objSpriteCopy } from "./obj-sprite-copy";
import { nlerp } from "../../lib/math/number";
import { Integer, Unit } from "../../lib/math/number-alias-types";

const r = new Rectangle();

export function objEye(
        scleraSpr: Sprite,
        pupilSpr: Sprite,
        eyelidTint: number,
        eyelidRestingInteger: Integer) {
    const scleraTx = scleraSpr.texture;

    const mask = objSpriteCopy(scleraSpr);

    const bounds = mask.getBounds(false, r);
    
    const pivotFactor = eyelidRestingInteger < 0 ? 1 : 0;

    const eyelid = new Graphics().beginFill(eyelidTint).drawRect(0, 0, scleraTx.width, scleraTx.height);
    eyelid.pivot.y = pivotFactor * scleraTx.height;
    eyelid.at(bounds.x, bounds.y + eyelid.pivot.y);

    const eyelidRestingScale = Math.abs(eyelidRestingInteger) / scleraTx.height;

    eyelid.scale.y = eyelidRestingScale;

    const c = container(mask, scleraSpr, pupilSpr, eyelid)
        .merge({ closed: 0 as Unit, look: vnew(), shapeObj: mask })
        .step(() => {
            eyelid.scale.y = Math.round(nlerp(eyelidRestingScale, 1, c.closed) * scleraTx.height) / scleraTx.height;
        })

    c.mask = mask;

    return c;
}

type ObjEye = ReturnType<typeof objEye>;

export function objEyes(left: ObjEye, right: ObjEye) {
    // TODO handle looking in directions!
    const c = container(left, right)
        .merge({ stepsUntilBlink: -1 as Integer, closed: -1 as Unit, eyelidMotion: 0 as Integer, left, right })
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