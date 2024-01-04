import { Sprite } from "pixi.js";
import { IguanaShapes } from "./shapes";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { IguanaLooks } from "./looks";
import { objEye, objEyes } from "./eye";
import { Rng } from "../../lib/math/rng";
import { Force } from "../../lib/types/force";

export function makeIguanaPuppetArgsFromLooks(looks: IguanaLooks.Serializable) {
    const { back, front, controller, feet } = objIguanaFeet(looks.feet);
    const body = objIguanaBody(looks.body);
    const head = objIguanaHead(looks.head);
    head.pivot.set(-5, 7);

    const c = container(back, body, head, front)
        .merge({ body, feet })
        .merge(controller);

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

    const back = container(backForeLeft, backForeRight, backHindLeft, backHindRight);
    const front = container(frontForeLeft, frontForeRight, frontHindLeft, frontHindRight);

    const foreLeft = backForeLeft.transform.position = frontForeLeft.transform.position;
    const foreRight = backForeRight.transform.position = frontForeRight.transform.position;
    const hindLeft = backHindLeft.transform.position = frontHindLeft.transform.position;
    const hindRight = backHindRight.transform.position = frontHindRight.transform.position;

    let isFacingRight = Force<boolean>();
    const controller = {
        get isFacingRight() {
            return isFacingRight;
        },

        set isFacingRight(value) {
            if (value === isFacingRight)
                return;

            const not = !value;
            backForeLeft.visible = value;
            backForeRight.visible = not;
            backHindLeft.visible = value;
            backHindRight.visible = not;

            frontForeLeft.visible = not;
            frontForeRight.visible = value;
            frontHindLeft.visible = not;
            frontHindRight.visible = value;
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

    const c = container(tail, torso).merge({ tail });

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
    const headShape = new Sprite(IguanaShapes.Face[0]);
    headShape.tint = head.color;

    const mouth = objIguanaMouth(head);
    const eyes = objIguanaEyes(head);

    const face = container(mouth, eyes).merge({ mouth, eyes });

    const hornShape = IguanaShapes.Horn[head.horn.shape];

    if (hornShape) {
        const horn = new Sprite(hornShape);
        horn.tint = head.horn.color;
        horn.pivot.set(-12, 4).add(head.horn.placement, -1);
        face.addChild(horn);
    }

    const crest = objIguanaCrest(head.crest);

    const c = container(crest, headShape, face)
        .merge({ crest, face });

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

    const eyes = objEyes(left, right).at(12, -8);

    eyes.stepsUntilBlink = Rng.int(40, 120);

    return eyes;
}

