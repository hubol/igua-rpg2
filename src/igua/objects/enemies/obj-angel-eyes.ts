import { Sprite, Texture } from "pixi.js";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { objEye, objEyes } from "../characters/obj-eye";

interface PupilRestStyle_CrossEyed {
    kind: "cross-eyed";
    offsetFromCenter: Integer;
}

type PupilRestStyle = PupilRestStyle_CrossEyed;

export interface ObjAngelEyesArgs {
    pupilTx: Texture;
    scleraTx: Texture;
    sclerasMirrored: boolean;
    eyelidsTint: Integer;
    gap: Integer;
    defaultEyelidRestingPosition: Integer;
    pupilRestStyle: PupilRestStyle;
}

export function objAngelEyes(args: ObjAngelEyesArgs) {
    // TODO use rest of configuration!
    const leftPupilPositionConfig = getPupilPositionConfig("left", args);
    const rightPupilPositionConfig = getPupilPositionConfig("right", args);

    const leftPupilObj = Sprite.from(args.pupilTx).anchored(0.5, 0.5).at(leftPupilPositionConfig.rest);
    const rightPupilObj = Sprite.from(args.pupilTx).anchored(0.5, 0.5).at(
        rightPupilPositionConfig.rest,
    );

    const leftScleraObj = Sprite.from(args.scleraTx);
    const rightScleraObj = Sprite.from(args.scleraTx).flipH(args.sclerasMirrored ? -1 : 1);

    const leftEyeX = -args.scleraTx.width - Math.ceil(args.gap / 2);
    const rightEyeX = Math.floor(args.gap / 2);

    const y = -Math.round(args.scleraTx.height / 2);

    const leftEyeObj = objEye(leftScleraObj, leftPupilObj, args.eyelidsTint, args.defaultEyelidRestingPosition).at(
        leftEyeX,
        y,
    );
    const rightEyeObj = objEye(rightScleraObj, rightPupilObj, args.eyelidsTint, args.defaultEyelidRestingPosition).at(
        rightEyeX,
        y,
    );

    const eyesObj = objEyes(leftEyeObj, rightEyeObj);
    eyesObj.stepsUntilBlink = Rng.int(40, 120);
    return eyesObj;
}

interface PupilPositionConfig {
    rest: VectorSimple;
    left: VectorSimple;
    right: VectorSimple;
    up: VectorSimple;
    down: VectorSimple;
}

function getPupilPositionConfig(eye: "left" | "right", args: ObjAngelEyesArgs): PupilPositionConfig {
    const sclera = getScleraUsableArea(args);

    const cx = sclera.x0 + Math.round((sclera.x1 - sclera.x0) / 2);
    const cy = sclera.y0 + Math.round((sclera.y1 - sclera.y0) / 2);

    // Prevent pupils with one skinny dimension from
    // becoming 1 pixel tall or wide
    const h = args.pupilTx.width < 3 ? 1 : 0;
    const v = args.pupilTx.height < 3 ? 1 : 0;

    const rest = { x: cx, y: cy };

    if (args.pupilRestStyle.kind === "cross-eyed") {
        const offset = Math.round(args.pupilTx.width / 2) + args.pupilRestStyle.offsetFromCenter;
        rest.x = eye === "left" ? sclera.x1 - offset : sclera.x0 + offset;
    }

    return {
        rest,
        left: { x: sclera.x0 + h, y: cy },
        right: { x: sclera.x1 - h, y: cy },
        up: { x: cx, y: sclera.y0 + v },
        down: { x: cx, y: sclera.y1 - v },
    };
}

function getScleraUsableArea(args: ObjAngelEyesArgs) {
    return {
        x0: 0,
        y0: Math.max(0, args.defaultEyelidRestingPosition),
        x1: args.scleraTx.width,
        y1: args.scleraTx.height,
    };
}
