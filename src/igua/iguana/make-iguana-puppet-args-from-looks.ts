import { Container, DisplayObject, Graphics, Rectangle, Sprite } from "pixi.js";
import { IguanaShapes } from "./shapes";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { IguanaLooks } from "./looks";
import { objEye, objEyes } from "./eye";
import { Rng } from "../../lib/math/rng";
import { Force } from "../../lib/types/force";

function showPivot<TContainer extends Container>(c: TContainer, color = 0x00ff00) {
    c.addChild(new Graphics().beginFill(color).drawRect(0, 0, 1, 1));
    return c;
}

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
    const c = inside ? Math.abs(mind - maxd) : mind + maxd;

    return sign * c;
}

export function makeIguanaPuppetArgsFromLooks(looks: IguanaLooks.Serializable) {
    const { back, front, controller: feetController, feet } = objIguanaFeet(looks.feet);
    const body = objIguanaBody(looks.body);
    const head = objIguanaHead(looks.head);
    head.pivot.set(-5, 7).add(looks.head.placement, -1);

    const headOffset = getFlippableOffsetX(head.noggin, body.torso);

    let facing = 1;

    const c = container(back, body, head, front)
        .merge({ body, feet })
        .merge({
            get facing() {
                return facing;
            },
            set facing(value) {
                if (value === facing || value === 0)
                    return;

                facing = value;
                const sign = Math.sign(facing);
                const right = sign > 0;

                body.scale.x = sign;
                back.scale.x = sign;
                front.scale.x = sign;
                back.x = right ? 0 : 1;
                front.x = right ? 0 : 1;

                c.pivot.x = right ? 0 : -1;

                const f = Math.abs(facing) < 0.75 ? 1 : 0;

                body.tail.x = f * 2;
                body.tail.y = -f;
                
                head.x = right ? -f * 4 : headOffset - 2 + f * 4;
                head.y = f * 2;

                head.isFacingRight = right;
                feetController.isFacingRight = right;
                feetController.turned = f * 2;
            }
        });

    return c;
}

function darken(color: number, amount = 0.225) {
    return AdjustColor.pixi(color).saturate(0.1).darken(amount).toPixi();
}

type Feet = IguanaLooks.Serializable['feet'];
type Foot = Feet['fore']['left'];

function objIguanaFoot(feet: Feet, key1: 'fore' | 'hind', key2: 'left' | 'right', back: boolean) {
    const foot: Foot = feet[key1][key2];
    const f = new Sprite(IguanaShapes.Foot[foot.shape]);

    if (back)
        f.pivot.x -= feet.backOffset;
    const gap = (7 + feet.gap) / 2;
    f.pivot.x += key1 === 'fore' ? -Math.ceil(gap) : Math.floor(gap);

    f.tint = back ? darken(foot.color) : foot.color;
    const clawsShape = IguanaShapes.Claws[foot.claws.shape];
    const claws = clawsShape ? new Sprite(clawsShape) : undefined;
    if (claws) {
        claws.tint = back ? darken(foot.claws.color) : foot.claws.color;
        claws.pivot.x -= foot.claws.placement;
        f.addChild(claws);
    }
    if (foot.flipV) {
        f.pivot.y -= f.height;
        f.scale.y = -1;
        if (claws) {
            claws.scale.y = -1;
            claws.pivot.y -= f.height;
        }
    }
    return f;
}

function objIguanaFeet(feet: Feet) {
    const backForeLeft = objIguanaFoot(feet, 'fore', 'left', true);
    const backForeRight = objIguanaFoot(feet, 'fore', 'right', true);
    const backHindLeft = objIguanaFoot(feet, 'hind', 'left', true);
    const backHindRight = objIguanaFoot(feet, 'hind', 'right', true);

    const frontForeLeft = objIguanaFoot(feet, 'fore', 'left', false);
    const frontForeRight = objIguanaFoot(feet, 'fore', 'right', false);
    const frontHindLeft = objIguanaFoot(feet, 'hind', 'left', false);
    const frontHindRight = objIguanaFoot(feet, 'hind', 'right', false);

    const backTurnContainer = container(backHindLeft, backHindRight);
    const frontTurnContainer = container(frontForeLeft, frontForeRight);

    const back = container(backForeLeft, backForeRight, backTurnContainer);
    const front = container(frontTurnContainer, frontHindLeft, frontHindRight);

    const foreLeft = backForeLeft.transform.position = frontForeLeft.transform.position;
    const foreRight = backForeRight.transform.position = frontForeRight.transform.position;
    const hindLeft = backHindLeft.transform.position = frontHindLeft.transform.position;
    const hindRight = backHindRight.transform.position = frontHindRight.transform.position;

    let isFacingRight = Force<boolean>();
    let turned = 0;

    const controller = {
        get isFacingRight() {
            return isFacingRight;
        },

        set isFacingRight(value) {
            if (value === isFacingRight)
                return;

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
            if (rounded === Math.round(turned))
                return;

            turned = value;
            frontTurnContainer.x = -rounded;
            backTurnContainer.x = rounded;
        }
    }

    controller.isFacingRight = true;

    return {
        back,
        front,
        controller,
        feet: {
            foreLeft,
            foreRight,
            hindLeft,
            hindRight,
        },
    }
}

type Body = IguanaLooks.Serializable['body'];

function objIguanaBody(body: Body) {
    const tail = new Sprite(IguanaShapes.Tail[body.tail.shape]);
    tail.tint = body.tail.color;
    tail.pivot.set(5, 11).add(body.tail.placement, -1);
    const torso = new Sprite(IguanaShapes.Torso[0]);
    torso.tint = body.color;
    torso.pivot.set(-1, 5);

    const c = container(tail, torso).merge({ torso, tail });

    const clubShape = IguanaShapes.Club[body.tail.club.shape];
    if (clubShape) {
        const club = new Sprite(clubShape);
        club.tint = body.tail.club.color;
        club.pivot.at(tail.pivot).add(-3, 8).add(body.tail.club.placement, -1);
        c.addChild(club);
    }

    c.pivot.set(-body.placement.x, -body.placement.y);
    return c;
}

type Head = IguanaLooks.Serializable['head'];

const mouthAgapeAnimationIndices = [ 1, 0, 2 ];

function objIguanaMouth(head: Head) {
    const flipV = head.mouth.flipV ? -1 : 1;

    const mouths = range(3).map(i => new Sprite(IguanaShapes.Mouth[head.mouth.shape])
        .tinted(head.mouth.color)
        .add(13, i - 2).add(head.mouth.placement)
        .flipV(flipV));

    let agapeUnit = 0;

    const c = container(...mouths)
        .merge({
            get agapeUnit() {
                return agapeUnit;
            },
            set agapeUnit(value: number) {
                agapeUnit = value;
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
            }
        });

    c.agapeUnit = 0;
    return c;
}

export function objIguanaHead(head: Head) {
    const noggin = new Sprite(IguanaShapes.Face[0]);
    noggin.tint = head.color;

    const mouth = objIguanaMouth(head);
    const eyes = objIguanaEyes(head);

    const eyesFacingLeftOffset = getFlippableOffsetX(undefined, noggin, compositeBounds(eyes.left.shapeObj, eyes.right.shapeObj));

    const hornShape = IguanaShapes.Horn[head.horn.shape];

    const crest = objIguanaCrest(head.crest);

    const back = container(crest, noggin, mouth);
    const front = container();

    if (hornShape) {
        const horn = new Sprite(hornShape);
        horn.tint = head.horn.color;
        horn.pivot.set(-12, 4).add(head.horn.placement, -1);
        front.addChild(horn);
    }

    let isFacingRight = true;

    const inner = container(back, eyes, front);

    const c = container(inner)
        .merge({ crest, noggin, eyes, mouth })
        .merge({
            get isFacingRight() {
                return isFacingRight;
            },
            set isFacingRight(value) {
                if (isFacingRight === value)
                    return;
                isFacingRight = value;

                inner.pivot.x = isFacingRight ? 0 : -noggin.width;
                eyes.x = isFacingRight ? 0 : eyesFacingLeftOffset - noggin.width;
                back.scale.x = isFacingRight ? 1 : -1;
                front.scale.x = isFacingRight ? 1 : -1;
            }
        });

    return c;
}

type Crest = Head['crest'];

function objIguanaCrest(crest: Crest) {
    const c = new Sprite(IguanaShapes.Crest[crest.shape]);
    c.pivot.add(-4, 13).add(crest.placement, -1);
    if (crest.flipV)
        c.flipV(-1);
    if (crest.flipH)
        c.flipH(-1);
    c.tint = crest.color;
    return c;
}

type Eye = Head['eyes']['left'];

const scleraTx = IguanaShapes.Eye[0];

const objIguanaSclera = () => new Sprite(scleraTx);
const objIguanaPupil = ({ pupil }: Eye) => new Sprite(IguanaShapes.Pupil[pupil.shape]).at(pupil.placement).tinted(pupil.color);
const objIguanaEye = (eye: Eye) => objEye(
    objIguanaSclera().flipH(eye.sclera.flipH ? -1 : 1),
    objIguanaPupil(eye),
    eye.eyelid.color,
    eye.eyelid.placement);

function objIguanaEyes(head: Head) {
    const left = objIguanaEye(head.eyes.left);
    const right = objIguanaEye(head.eyes.right).at((left.mask! as Sprite).width + head.eyes.gap, 0);

    left.y = head.eyes.tilt;

    const eyes = objEyes(left, right);
    eyes.pivot.at(-12, 8).add(head.eyes.placement, -1);

    eyes.stepsUntilBlink = Rng.int(40, 120);

    return eyes;
}

