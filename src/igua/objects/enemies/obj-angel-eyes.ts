import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { vlerp } from "../../../lib/math/vector";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { Empty } from "../../../lib/types/empty";
import { objEye, objEyes } from "../characters/obj-eye";

interface PupilRestStyle_CrossEyed {
    kind: "cross_eyed";
    offsetFromCenter: Integer;
}

type PupilRestStyle = PupilRestStyle_CrossEyed;

export interface ObjAngelEyesArgs {
    pupilTx: Texture;
    pupilsMirrored?: boolean;
    scleraTx: Texture;
    sclerasMirrored?: boolean;
    eyelidsTint: Integer;
    gap: Integer;
    defaultEyelidRestingPosition: Integer;
    pupilRestStyle: PupilRestStyle;
}

const v = vnew();

export function objAngelEyes(args: ObjAngelEyesArgs) {
    // TODO use rest of configuration!
    const leftPupilPositionConfig = getPupilPositionConfig("left", args);
    const rightPupilPositionConfig = getPupilPositionConfig("right", args);

    const leftPupilObj = Sprite.from(args.pupilTx).anchored(0.5, 0.5).at(leftPupilPositionConfig.rest);
    const rightPupilObj = Sprite.from(args.pupilTx).anchored(0.5, 0.5).at(
        rightPupilPositionConfig.rest,
    )
        .scaled(args.pupilsMirrored ? -1 : 1, 1);

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

    const injuredLeftEyeObj = Sprite.from(Tx.Enemy.Common.Eyes.Injured0).anchored(0.5, 0.5).at(leftEyeObj)
        .add(
            Math.round(leftEyeObj.width / 2),
            Math.round(leftEyeObj.height / 2),
        )
        .add(scleraToInjuredOffsets.get(args.scleraTx) ?? vzero)
        .invisible()
        .scaled(-1, 1)
        .show(
            eyesObj,
        );
    const injuredRightEyeObj = Sprite.from(Tx.Enemy.Common.Eyes.Injured0).anchored(0.5, 0.5)
        .at(rightEyeObj)
        .add(
            Math.round(rightEyeObj.width / 2),
            Math.round(rightEyeObj.height / 2),
        )
        .add(scleraToInjuredOffsets.get(args.scleraTx) ?? vzero)
        .invisible()
        .show(eyesObj);

    return eyesObj
        .merge({
            get injuredLeft() {
                return injuredLeftEyeObj.visible;
            },
            set injuredLeft(value) {
                injuredLeftEyeObj.visible = value;
                leftEyeObj.visible = !value;
            },
            get injuredRight() {
                return injuredRightEyeObj.visible;
            },
            set injuredRight(value) {
                injuredRightEyeObj.visible = value;
                rightEyeObj.visible = !value;
            },
            pupilPolarOffsets: Empty<VectorSimple>(),
        })
        .step((self) => {
            injuredLeftEyeObj.tint = leftPupilObj.tint;
            injuredRightEyeObj.tint = rightPupilObj.tint;

            for (let i = self.pupilPolarOffsets.length - 1; i >= 0; i--) {
                const polar = self.pupilPolarOffsets[i];
                if (polar) {
                    leftPupilObj.at(lerpPupilPosition(leftPupilPositionConfig, polar));
                    rightPupilObj.at(lerpPupilPosition(rightPupilPositionConfig, polar));
                    break;
                }
            }
        });
}

function lerpPupilPosition(config: PupilPositionConfig, polar: VectorSimple) {
    v.at(config.rest);
    if (polar.x !== 0) {
        vlerp(v, polar.x > 0 ? config.right : config.left, Math.abs(polar.x));
    }
    if (polar.y !== 0) {
        vlerp(v, polar.y > 0 ? config.down : config.up, Math.abs(polar.y));
    }
    return v.vround();
}

export type ObjAngelEyes = ReturnType<typeof objAngelEyes>;

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
    const h = args.pupilTx.width < 3 ? 2 : 3;
    const v = args.pupilTx.height < 3 ? 2 : 3;

    const rest = { x: cx, y: cy };

    if (args.pupilRestStyle.kind === "cross_eyed") {
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

const scleraToInjuredOffsets = new Map<Texture, VectorSimple>();
scleraToInjuredOffsets.set(Tx.Enemy.Suggestive.Sclera, [0, 2]);
scleraToInjuredOffsets.set(Tx.Enemy.Suggestive.ScleraWide, [0, -2]);
const vzero = vnew();

objAngelEyes.objEyeRoller = function objEyeRoller (angelEyesObj: ObjAngelEyes) {
    let count = 0;
    const polarOffset = vnew();

    return container()
        .step(() => {
            count++;
            const rads = count * 0.04 * Math.PI;
            angelEyesObj.pupilPolarOffsets[1] = polarOffset.at(
                Math.sin(rads),
                Math.cos(rads),
            );
        })
        .on("removed", () => delete angelEyesObj.pupilPolarOffsets[1]);
};
