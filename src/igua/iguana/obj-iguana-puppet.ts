import { DisplayObject, Rectangle, Sprite } from "pixi.js";
import { IguanaShape, IguanaShapes } from "./shapes";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { IguanaLooks } from "./looks";
import { objEye, objEyes } from "../objects/characters/obj-eye";
import { Rng } from "../../lib/math/rng";
import { Force } from "../../lib/types/force";
import { Integer, Polar, Unit, ZeroOrGreater } from "../../lib/math/number-alias-types";
import { vnew } from "../../lib/math/vector-type";
import { CollisionShape } from "../../lib/pixi/collision";
import { Material, Materials } from "../systems/materials";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { mxnHasHead } from "../mixins/mxn-has-head";

const r1 = new Rectangle();
const r2 = new Rectangle();
const r3 = new Rectangle();
const r4 = new Rectangle();
const r5 = new Rectangle();

function compositeBounds(d1: DisplayObject, d2: DisplayObject) {
    d1.getBounds(false, r3);
    d2.getBounds(false, r4);
    r5.x = Math.min(r3.x, r4.x);
    r5.width = Math.max(r3.x + r3.width, r4.x + r4.width) - r5.x;
    return r5;
}

function getFlippableOffsetX(src: DisplayObject | undefined, dst: DisplayObject, bounds?: Rectangle) {
    const rr1 = src ? src.getBounds(false, r1) : bounds!;
    dst.getBounds(false, r2);

    const mind = Math.abs(rr1.x - r2.x);
    const r1x2 = rr1.x + rr1.width;
    const r2x2 = r2.x + r2.width;
    const maxd = Math.abs(r1x2 - r2x2);

    const inside = rr1.x >= r2.x && r1x2 <= r2x2;
    const sign = maxd > mind ? 1 : -1;
    const srcWiderThanDst = rr1.width > r2.width;
    const c = inside
        ? Math.abs(mind - maxd)
        : (srcWiderThanDst ? (mind === maxd ? 0 : -mind - maxd) : mind + maxd);

    return sign * c;
}

export function objIguanaPuppet(looks: IguanaLooks.Serializable) {
    const iguanaSprites: IguanaSprite[] = [];
    IguanaSprite.resetList();

    const { back, front, controller: feetController, feet } = objIguanaFeet(looks.feet);
    const body = objIguanaBody(looks.body);
    const head = objIguanaHead(looks.head);
    head.pivot.set(-7, 14).add(looks.head.placement, -1);

    const nogginMaxY = head.noggin.getMaxY();
    const torsoMaxY = body.torso.getMaxY();

    const bodyDuckMaximum = Math.max(1, -torsoMaxY);
    const bodyLandMaximum = bodyDuckMaximum;
    const headDuckMaximum = 2 + Math.max(0, -nogginMaxY - 9);
    const headRaiseMaximum = (head.noggin.getMaxY() - body.torso.getMinY()) > 2 ? 2 : 0;

    const headOffset = getFlippableOffsetX(head.noggin, body.torso) - 4 + body.pivot.x * 2;

    let facing: Polar = 1;
    let ducking: Unit = 0;

    let pedometer: ZeroOrGreater = 0;
    let gait: Unit = 0;

    let isAirborne = false;
    let airborneDirectionY: Polar = 0;

    let isLanding = false;
    let landingFrames: Integer = 0;
    let landingFramesMax = 0;

    const core = container(body, head);

    const feetLiftMaximum = Math.max(0, bodyDuckMaximum - 1);

    let dirty = true;
    let sinceStepSoundEffectFrames = 0;

    const applyAnimation = () => {
        if (!dirty) {
            return;
        }

        let landing = 0;

        if (isLanding) {
            landing = landingFrames / landingFramesMax;
            landingFrames = Math.max(0, landingFrames - 1);
            if (landingFrames === 0) {
                isLanding = false;
            }
            dirty = true;
        }
        else {
            dirty = false;
        }

        let facingPartialF = 0;

        const facingSign = Math.sign(facing);
        const facingRight = facingSign > 0;

        // Facing animation
        {
            body.scale.x = facingSign;
            back.scale.x = facingSign;
            front.scale.x = facingSign;

            c.pivot.x = facingRight ? 4 : -3;

            const abs = Math.abs(facing);

            if (abs < 0.3) {
                facingPartialF = 1.2;
            }
            else if (abs < 0.6) {
                facingPartialF = 1;
            }
            else if (abs < 0.8) {
                facingPartialF = 0.5;
            }

            head.isFacingRight = facingRight;
            feetController.isFacingRight = facingRight;
            feetController.turned = Math.round(facingPartialF * 2);
        }

        const airborne = isAirborne ? airborneDirectionY : 0;

        // Walking + Jumping + Falling
        const p = -pedometer * Math.PI * 0.75;
        {
            const airborne2 = Math.min(1.25, Math.abs(airborne * 1.5)) * Math.sign(airborne);

            const prevForeLeftY = feetController.foreLeftY;
            const prevForeRightY = feetController.foreRightY;
            const prevHindLeftY = feetController.hindLeftY;
            const prevHindRightY = feetController.hindRightY;

            const g = Math.round(gait * 2) / 2;

            feetController.foreLeftY = Math.round(
                g * Math.round(Math.sin(p) - 1) * 2 + Math.min(0, airborne2 * -feetLiftMaximum),
            );
            feetController.foreRightY = Math.round(
                g * Math.round(Math.sin(p + Math.PI / 2) - 1) * 2 + Math.min(0, airborne * -feetLiftMaximum),
            );
            feetController.hindLeftY = Math.round(
                g * Math.round(Math.sin(p + Math.PI) - 1) * 2 + Math.min(0, airborne * feetLiftMaximum),
            );
            feetController.hindRightY = Math.round(
                g * Math.round(Math.sin(p + 3 * Math.PI / 2) - 1) * 2 + Math.min(0, airborne2 * feetLiftMaximum),
            );

            sinceStepSoundEffectFrames++;

            if (!isAirborne && sinceStepSoundEffectFrames > 3) {
                if (prevForeLeftY < 0 && feetController.foreLeftY === 0) {
                    c.play(Materials[c.groundMaterial].stepSound0);
                    sinceStepSoundEffectFrames = 0;
                }
                else if (prevForeRightY < 0 && feetController.foreRightY === 0) {
                    c.play(Materials[c.groundMaterial].stepSound1);
                    sinceStepSoundEffectFrames = 0;
                }
                else if (prevHindLeftY < 0 && feetController.hindLeftY === 0) {
                    c.play(Materials[c.groundMaterial].stepSound2);
                    sinceStepSoundEffectFrames = 0;
                }
                else if (prevHindRightY < 0 && feetController.hindRightY === 0) {
                    c.play(Materials[c.groundMaterial].stepSound3);
                    sinceStepSoundEffectFrames = 0;
                }
            }
        }

        const bodyGait = (isAirborne || Math.abs(facing) !== 1) ? 0 : gait;

        // Apply
        body.tail.x = Math.round(facingPartialF * 2);
        body.tail.y = Math.round(-facingPartialF + (airborne > 0 ? 2 : 0) + (bodyGait * Math.cos(p / 2 + 2)));

        body.tail.club?.at(
            body.tail.x,
            body.tail.club.isProbablyAttachedToTail ? body.tail.y : Math.round(-facingPartialF),
        );

        const d = Math.round((1 - Math.sqrt(1 - ducking)) * 3) / 3;

        head.x = Math.round(facingRight ? -facingPartialF * 5 : headOffset + facingPartialF * 5);
        head.y = Math.round(
            (bodyGait * (Math.cos(p / 2 + 1) - 1)) + facingPartialF * 2 + d * headDuckMaximum
                + (airborne > 0 ? -headRaiseMaximum : 0),
        );

        core.y = Math.round(
            (bodyGait * (Math.cos(p / 2) + 1) / 2)
                + Math.min(Math.max(ducking * bodyDuckMaximum, landing * bodyLandMaximum), bodyDuckMaximum),
        );
        feetController.spread = ducking;
    };

    const c = container(back, core, front)
        .collisionShape(CollisionShape.DisplayObjects, [head.crest, head.noggin, body.torso, ...feet.shapes])
        .mixin(mxnHasHead, { obj: head.noggin })
        .merge({ head, body, feet })
        .merge({
            get facing() {
                return facing;
            },
            set facing(value) {
                if (value !== 0 && value !== facing) {
                    facing = value;
                    dirty = true;
                }
            },
            get ducking() {
                return ducking;
            },
            set ducking(value) {
                if (value !== ducking) {
                    ducking = value;
                    dirty = true;
                }
            },
            get pedometer() {
                return pedometer;
            },
            set pedometer(value) {
                if (pedometer !== value) {
                    pedometer = value;
                    dirty = true;
                }
            },
            get gait() {
                return gait;
            },
            set gait(value) {
                if (gait !== value) {
                    gait = value;
                    dirty = true;
                }
            },
            get isAirborne() {
                return isAirborne;
            },
            set isAirborne(value) {
                if (isAirborne !== value) {
                    isAirborne = value;
                    dirty = true;
                }
            },
            get airborneDirectionY() {
                return airborneDirectionY;
            },
            set airborneDirectionY(value) {
                if (airborneDirectionY !== value) {
                    airborneDirectionY = value;
                    dirty = true;
                }
            },
            get landingFrames() {
                return landingFrames;
            },
            set landingFrames(value) {
                if (value !== 0 && landingFrames !== value) {
                    landingFrames = value;
                    landingFramesMax = value;
                    isLanding = true;
                    dirty = true;
                }
            },
            groundMaterial: Material.Earth,
        })
        .step(applyAnimation)
        .coro(function* () {
            while (true) {
                for (let i = 0; i < iguanaSprites.length; i++) {
                    iguanaSprites[i].setBoiled(Rng.bool());
                    if (Rng.bool()) {
                        yield sleep(20);
                    }
                }

                yield sleep(40);
            }
        });

    for (const sprite of IguanaSprite.getList()) {
        iguanaSprites.push(sprite);
    }

    return c;
}

type Feet = IguanaLooks.Serializable["feet"];
type Foot = Feet["fore"]["left"];

function objIguanaFoot(feet: Feet, key1: "fore" | "hind", key2: "left" | "right", back: boolean) {
    const foot: Foot = feet[key1][key2];
    const f = new IguanaSprite(IguanaShapes.Foot[foot.shape]);

    if (back) {
        f.pivot.x -= feet.backOffset;
    }
    const gap = (11 + feet.gap) / 2;
    f.pivot.x += key1 === "fore" ? -Math.ceil(gap) : Math.floor(gap);

    f.tint = back ? IguanaLooks.darkenBackFeet(foot.color) : foot.color;
    const clawShape = IguanaShapes.Claws[foot.claws.shape];
    const claws = clawShape
        ? new IguanaSprite(clawShape)
        : undefined;
    if (claws) {
        claws.tint = back ? IguanaLooks.darkenBackFeet(foot.claws.color) : foot.claws.color;
        claws.pivot.x -= foot.claws.placement;
        f.addChild(claws);
    }

    if (back) {
        f.pivot.y = 1;
    }

    return f;
}

function objIguanaFeet(feet: Feet) {
    const backForeLeft = objIguanaFoot(feet, "fore", "left", true);
    const backForeRight = objIguanaFoot(feet, "fore", "right", true);
    const backHindLeft = objIguanaFoot(feet, "hind", "left", true);
    const backHindRight = objIguanaFoot(feet, "hind", "right", true);

    const frontForeLeft = objIguanaFoot(feet, "fore", "left", false);
    const frontForeRight = objIguanaFoot(feet, "fore", "right", false);
    const frontHindLeft = objIguanaFoot(feet, "hind", "left", false);
    const frontHindRight = objIguanaFoot(feet, "hind", "right", false);

    const backTurnContainer = container(backHindLeft, backHindRight);
    const frontTurnContainer = container(frontForeLeft, frontForeRight);

    const back = container(backForeLeft, backForeRight, backTurnContainer);
    const front = container(frontTurnContainer, frontHindLeft, frontHindRight);

    let isFacingRight = Force<boolean>();
    let turned: ZeroOrGreater = 0;

    let spread: Unit = 0;

    const controller = {
        get isFacingRight() {
            return isFacingRight;
        },

        set isFacingRight(value) {
            if (value === isFacingRight) {
                return;
            }

            isFacingRight = value;
            const not = !value;
            backForeLeft.visible = value;
            backForeRight.visible = not;
            backHindLeft.visible = value;
            backHindRight.visible = not;

            frontForeLeft.visible = not;
            frontForeRight.visible = value;
            frontHindLeft.visible = not;
            frontHindRight.visible = value;
        },

        get turned() {
            return turned;
        },

        set turned(value) {
            const rounded = Math.round(value);
            if (rounded === Math.round(turned)) {
                return;
            }

            turned = value;
            frontTurnContainer.x = -rounded;
            backTurnContainer.x = rounded;
        },

        get spread() {
            return spread;
        },

        set spread(value) {
            if (spread === value) {
                return;
            }
            const toApply = Math.round(value * 3) * 2;
            const toApplySqrt = Math.round(Math.sqrt(value) * 3) * 2;
            spread = value;

            backForeLeft.x = toApply;
            backForeRight.x = toApply;
            backHindLeft.x = -toApply;
            backHindRight.x = -toApply;

            frontForeLeft.x = toApplySqrt;
            frontForeRight.x = toApplySqrt;
            frontHindLeft.x = -toApplySqrt;
            frontHindRight.x = -toApplySqrt;
        },

        get foreLeftY() {
            return frontForeLeft.y;
        },

        set foreLeftY(value: Integer) {
            frontForeLeft.y = value;
            backForeLeft.y = value;
        },

        get foreRightY() {
            return frontForeRight.y;
        },

        set foreRightY(value: Integer) {
            frontForeRight.y = value;
            backForeRight.y = value;
        },

        get hindLeftY() {
            return frontHindLeft.y;
        },

        set hindLeftY(value: Integer) {
            frontHindLeft.y = value;
            backHindLeft.y = value;
        },

        get hindRightY() {
            return frontHindRight.y;
        },

        set hindRightY(value: Integer) {
            frontHindRight.y = value;
            backHindRight.y = value;
        },
    };

    controller.isFacingRight = true;

    return {
        back,
        front,
        controller,
        feet: {
            shapes: [frontForeLeft, frontForeRight, frontHindLeft, frontHindRight],
        },
    };
}

type Body = IguanaLooks.Serializable["body"];

const tailClubOffets = [
    vnew(),
    vnew(0, -1),
    vnew(1, -1),
    vnew(1, 0),
    vnew(1, 1),
    vnew(0, 1),
    vnew(-1, 1),
    vnew(-1, 0),
    vnew(-1, -1),
];

function objIguanaBody(body: Body) {
    const tailSpr = new IguanaSprite(IguanaShapes.Tail.Shapes[body.tail.shape]);
    const clubObj = objIguanaTailClub(body);

    const tail = tailSpr
        .merge({
            club: clubObj?.merge({
                isProbablyAttachedToTail: tailClubOffets.some(offset => clubObj.collides(tailSpr, offset)),
            }),
        });
    tail.tint = body.tail.color;
    tail.pivot.set(8, 17).add(body.tail.placement, -1);
    const torso = new IguanaSprite(IguanaShapes.Torso[0]);
    torso.tint = body.color;
    torso.pivot.set(-2, 8);

    tail.club?.pivot?.add(tail.pivot);

    const c = container(tail, torso).merge({ torso, tail });
    tail.club?.show(c);

    c.pivot.set(-body.placement.x, -body.placement.y);
    return c;
}

function objIguanaTailClub(body: Body) {
    const clubShape = IguanaShapes.Club[body.tail.club.shape];
    if (!clubShape) {
        return null;
    }

    const club = new IguanaSprite(clubShape);
    club.tint = body.tail.club.color;
    club.pivot.at(IguanaShapes.Tail.getClubPlacement(body.tail.shape)).add(body.tail.club.placement, -1);

    return club;
}

type Head = IguanaLooks.Serializable["head"];

const mouthAgapeAnimationIndices = [1, 0, 2];

function objIguanaMouth(head: Head) {
    const flipV = head.mouth.flipV ? -1 : 1;

    const mouths = range(3).map(i =>
        new IguanaSprite(IguanaShapes.Mouth[head.mouth.shape])
            .tinted(head.mouth.color)
            .add(20, i - 2).add(head.mouth.placement)
            .flipV(flipV)
    );

    let agape: Unit = 0;

    const c = container(...mouths)
        .merge({
            get agape() {
                return agape;
            },
            set agape(value) {
                agape = value;
                const index = Math.floor(Math.max(0, Math.min(2, value * 3)));
                for (let i = 0; i < mouths.length; i++) {
                    mouths[mouthAgapeAnimationIndices[i]].visible = index >= i;
                }
            },
            emote: {
                clear() {
                    for (let i = 0; i < mouths.length; i++) {
                        mouths[i].flipV(flipV);
                    }
                },
                happy() {
                    for (let i = 0; i < mouths.length; i++) {
                        mouths[i].flipV(1);
                    }
                },
                sad() {
                    for (let i = 0; i < mouths.length; i++) {
                        mouths[i].flipV(-1);
                    }
                },
            },
        });

    c.agape = 0;
    return c;
}

export function objIguanaHead(head: Head) {
    const noggin = new IguanaSprite(IguanaShapes.Face[0]);
    noggin.tint = head.color;

    const mouth = objIguanaMouth(head);
    const eyes = objIguanaEyes(head);

    const eyesFacingLeftOffset = getFlippableOffsetX(
        undefined,
        noggin,
        compositeBounds(eyes.left.shapeObj, eyes.right.shapeObj),
    );

    const hornShape = IguanaShapes.Horn[head.horn.shape];

    const crest = container(objIguanaCrest(head.crest));

    const back = container(noggin, mouth);
    const front = container();

    if (hornShape) {
        const horn = new IguanaSprite(hornShape);
        horn.tint = head.horn.color;
        horn.pivot.set(-19, 6).add(head.horn.placement, -1);
        front.addChild(horn);
    }

    let isFacingRight = true;

    const inner = container(back, eyes, front);

    inner.addChildAt(crest, head.crest.behind ? 0 : 3);

    const c = container(inner)
        .merge({ crest, noggin, eyes, mouth })
        .merge({
            get isFacingRight() {
                return isFacingRight;
            },
            set isFacingRight(value) {
                if (isFacingRight === value) {
                    return;
                }
                isFacingRight = value;

                inner.pivot.x = isFacingRight ? 0 : -noggin.width;
                eyes.x = isFacingRight ? 0 : eyesFacingLeftOffset - noggin.width;
                eyes.isFacingRight = isFacingRight;
                back.scale.x = isFacingRight ? 1 : -1;
                crest.scale.x = isFacingRight ? 1 : -1;
                front.scale.x = isFacingRight ? 1 : -1;
            },
        });

    return c;
}

type Crest = Head["crest"];

function objIguanaCrest(crest: Crest) {
    const c = new IguanaSprite(IguanaShapes.Crest[crest.shape]);
    c.pivot.add(-6, 17).add(crest.placement, -1);
    if (crest.flipV) {
        c.flipV(-1);
    }
    if (crest.flipH) {
        c.flipH(-1);
    }
    c.tint = crest.color;
    return c;
}

type Eye = Head["eyes"]["left"];

const scleraTx = IguanaShapes.Eye[0];

const objIguanaSclera = () => new IguanaSprite(scleraTx);

const objIguanaEye = (eye: Eye, pupils: Head["eyes"]["pupils"], isLeft: boolean) => {
    const scleraObj = objIguanaSclera().flipH(isLeft ? 1 : -1);
    const pupilObj = new IguanaSprite(IguanaShapes.Pupil[eye.pupil.shape]).tinted(eye.pupil.color);
    if (isLeft || !pupils.mirrored) {
        pupilObj.at(eye.pupil.placement).add(pupils.placement);
        pupilObj.flipH(eye.pupil.flipH ? -1 : 1);
    }
    else {
        const max = Math.max(pupilObj.width, scleraObj.width);
        const min = Math.min(pupilObj.width, scleraObj.width);
        pupilObj.at(eye.pupil.placement).add(-pupils.placement.x, pupils.placement.y).add(min - max, 0);
        pupilObj.flipH(eye.pupil.flipH ? 1 : -1);
    }

    return objEye(
        scleraObj,
        pupilObj,
        eye.eyelid.color,
        eye.eyelid.placement,
    );
};

function objIguanaEyes(head: Head) {
    const left = objIguanaEye(head.eyes.left, head.eyes.pupils, true);
    const right = objIguanaEye(head.eyes.right, head.eyes.pupils, false).at(
        left.shapeObj.width + head.eyes.gap,
        0,
    );

    const leftPupilScaleX = left.pupilSpr.scale.x;
    const rightPupilScaleX = right.pupilSpr.scale.x;
    const leftPupilX = left.pupilSpr.x;
    const rightPupilX = right.pupilSpr.x;

    const leftOffsetX = getEyeOffsetX(left);
    const rightOffsetX = getEyeOffsetX(right);

    left.y = head.eyes.tilt;

    let isFacingRight = true;

    const eyes = objEyes(left, right).merge({
        get isFacingRight() {
            return isFacingRight;
        },
        set isFacingRight(value) {
            if (isFacingRight === value) {
                return;
            }
            isFacingRight = value;

            // TODO should be behind some advanced setting
            // "Direction-Sensitive Eye Tilt"
            left.y = isFacingRight ? head.eyes.tilt : 0;
            right.y = isFacingRight ? 0 : head.eyes.tilt;

            if (!head.eyes.pupils.mirrored) {
                left.pupilSpr.flipH((isFacingRight ? 1 : -1) * leftPupilScaleX);
                left.pupilSpr.x = leftPupilX + (isFacingRight ? 0 : leftOffsetX);

                right.pupilSpr.flipH((isFacingRight ? 1 : -1) * rightPupilScaleX);
                right.pupilSpr.x = rightPupilX + (isFacingRight ? 0 : rightOffsetX);
            }
        },
    });
    eyes.pivot.at(-19, 12).add(head.eyes.placement, -1);

    eyes.stepsUntilBlink = Rng.int(40, 120);

    return eyes;
}

class IguanaSprite extends Sprite {
    private static readonly _list: IguanaSprite[] = [];

    static resetList() {
        this._list.length = 0;
    }

    static getList() {
        return this._list;
    }

    private _boiled = false;

    constructor(readonly shape: IguanaShape) {
        super(shape.Tx);
        IguanaSprite._list.push(this);
    }

    setBoiled(value: boolean) {
        if (value === this._boiled) {
            return;
        }

        if (value) {
            this.texture = this.shape.BoiledTx;
            this._boiled = true;
        }
        else {
            this.texture = this.shape.Tx;
            this._boiled = false;
        }

        this.anchor.at(this.texture.defaultAnchor);
    }
}

const r6 = new Rectangle();

function getEyeOffsetX(eyeObj: ReturnType<typeof objIguanaEye>) {
    return getFlippableOffsetX(eyeObj.pupilSpr, eyeObj.shapeObj, r6);
}
