import { Sprite } from "pixi.js";
import { IguanaShapes } from "./shapes";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { IguanaLooks } from "./looks";
import { objEye, objEyes } from "./eye";
import { Rng } from "../../lib/math/rng";

export function makeIguanaPuppetArgsFromLooks(looks: IguanaLooks.Serializable) {
    const backLeftFoot = makeFoot(looks.feet, "hind", true);
    const backRightFoot = makeFoot(looks.feet, "hind", false);
    const frontLeftFoot = makeFoot(looks.feet, "front", true);
    const frontRightFoot = makeFoot(looks.feet, "front", false);
    const body = makeBody(looks.body);
    const { head, crest, eyes } = objIguanaHead(looks.body, looks.head);

    return {
        body,
        crest,
        eyes,
        head,
        backLeftFoot,
        backRightFoot,
        frontLeftFoot,
        frontRightFoot,
    };
}

function darken(color: number, amount = 0.225) {
    return AdjustColor.pixi(color).saturate(0.1).darken(amount).toPixi();
}

function makeFootTint(color: number, back: boolean) {
    if (!back)
        return color;
    return darken(color);
}

type Feet = IguanaLooks.Serializable['feet'];

function makeFoot(feet: Feet, key: 'hind' | 'front', back: boolean) {
    const foot = feet[key];
    const f = new Sprite(IguanaShapes.Foot[foot.shape]);
    if (back)
        f.pivot.x -= feet.backOffset;
    const gap = (7 + feet.gap) / 2;
    f.pivot.x += key === 'front' ? -Math.ceil(gap) : Math.floor(gap);
    f.tint = makeFootTint(feet.color, back);
    // TODO collision f.ext.precise = true;
    const clawsShape = IguanaShapes.Claws[foot.claws.shape];
    const claws = clawsShape ? new Sprite(clawsShape) : undefined;
    if (claws) {
        claws.tint = makeFootTint(feet.clawColor, back);
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

type Body = IguanaLooks.Serializable['body'];

function makeBody(body: Body) {
    const tail = new Sprite(IguanaShapes.Tail[body.tail.shape]);
    tail.tint = body.tail.color;
    tail.pivot.set(5, 11).add(body.tail.placement, -1);
    const torso = new Sprite(IguanaShapes.Torso[0]);
    torso.tint = body.color;
    torso.pivot.set(-1, 5);

    // TODO collision
    // tail.ext.precise = true;
    // torso.ext.precise = true;

    const c = container(tail, torso);
    // TODO collision
    // c.ext.tail = tail;

    const clubShape = IguanaShapes.Club[body.tail.club.shape];
    if (clubShape) {
        const club = new Sprite(clubShape);
        // TODO collision
        // club.ext.precise = true;
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

function objIguanaHead(body: Body, head: Head) {
    const face = new Sprite(IguanaShapes.Face[0]);
    face.tint = head.color;

    const mouth = objIguanaMouth(head);

    const crest = objIguanaCrest(head.crest);

    const eyes = objIguanaEyes(head);

    const h = container(crest, face, mouth, eyes)
        .merge({ mouth });

    const hornShape = IguanaShapes.Horn[head.horn.shape];

    if (hornShape) {
        const horn = new Sprite(hornShape);
        horn.tint = head.horn.color;
        horn.pivot.set(-12, 4).add(head.horn.placement, -1);
        h.addChild(horn);
    }

    h.pivot.add(body.placement, -1).add(head.placement, -1);

    return { crest, head: h, eyes };
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

