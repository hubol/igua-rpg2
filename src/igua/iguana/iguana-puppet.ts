import { Container, DisplayObject } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Rng } from "../../lib/math/rng";
import { approachLinear, nlerp } from "../../lib/math/number";
import { Force } from "../../lib/types/force";

export interface IguanaPuppetArgs {
    body: DisplayObject;
    backLeftFoot: DisplayObject;
    backRightFoot: DisplayObject;
    frontLeftFoot: DisplayObject;
    frontRightFoot: DisplayObject;
    head: DisplayObject;
    // eyes: DisplayObject;
    // eyes: IguanaEyes | DisplayObject;
    // crest: DisplayObject;
    moveCrestWhenDucking?: boolean;
    fromLooks?: boolean;
}

// export type IguanaPuppet = ReturnType<typeof iguanaPuppet>;
export type IguanaPuppetNoEngine = ReturnType<typeof iguanaPuppetNoEngine>;

export function iguanaPuppet(args: IguanaPuppetArgs)
{
    return iguanaPuppetNoEngine(args);
    // const puppetNoEngine = iguanaPuppetNoEngine(args);
    // const engine = makeIguanaPuppetEngine(puppetNoEngine);
    // return merge(puppetNoEngine, { engine, mods: makeIguanaMods(puppetNoEngine), walkTo: engine.walkTo });
}

export function iguanaHead(args: IguanaPuppetArgs, attachToBody = false) {
    if (!attachToBody)
        args.head.pivot.set(0, 0);

    args.head.pivot.add(0, -15);
    return args.head;
}

export function iguanaPuppetNoEngine(args: IguanaPuppetArgs)
{
    const head = iguanaHead(args, true);

    // if (!args.fromLooks) {
    //     args.body.pivot.y -= 5;

    //     args.backLeftFoot.pivot.x += -6;
    //     args.backLeftFoot.pivot.y += -21;

    //     args.frontLeftFoot.pivot.x += -15;
    //     args.frontLeftFoot.pivot.y += -21;

    //     args.backRightFoot.pivot.x += -3;
    //     args.backRightFoot.pivot.y += -21;

    //     args.frontRightFoot.pivot.x += -12;
    //     args.frontRightFoot.pivot.y += -21;

    //     head.pivot.set(-15, -5);
    // }
    // else
        head.pivot.add(-5, 22);

    const body = new Container();
    body.addChild(args.body, head);

    const innerContainer = container();

    // TODO fubar
    const player = container(innerContainer).merge({
        head,
        isDucking: false,
        duckUnit: 0,
        hspeed: 0,
        vspeed: 0,
        headLiftUnit: 0,
        _forceWalkAnimation: 0,
        feet: [ args.backLeftFoot, args.backRightFoot, args.frontLeftFoot, args.frontRightFoot ],
        duckImmediately()
        {
            player.isDucking = true;
            player.duckUnit = 1;
        },
    });

    innerContainer.addChild(args.backLeftFoot, args.frontLeftFoot, body, args.backRightFoot, args.frontRightFoot);
    player.pivot.set(1, -10);

    let trip = 0;
    let lastXscale = Force<number>();
    let facingSteps = 0;
    let faceXscale = Force<number>();

    const puppetStep = () => {
        return;
        const barelyWalking = Math.abs(player.hspeed) < 0.1;

        trip += player.hspeed + player._forceWalkAnimation;

        if (player.vspeed !== 0 && barelyWalking)
            trip += 0.5;

        body.position.set(0, 0);
        args.backLeftFoot.position.set(0, 0);
        args.backRightFoot.position.set(0, 0);
        args.frontLeftFoot.position.set(0, 0);
        args.frontRightFoot.position.set(0, 0);

        if (!barelyWalking || player.vspeed !== 0 || player._forceWalkAnimation > 0) {
            const t =trip * 0.1;
            if (player.vspeed === 0)
                body.position.y = Math.round(Math.sin(t + 2));
            args.backLeftFoot.position.y = Math.round(Math.abs(Math.sin(t + 1)) * -2);
            args.backRightFoot.position.y = Math.round(Math.abs(Math.sin(t)) * -2);
            args.frontLeftFoot.position.y = Math.round(Math.abs(Math.cos(t + 1)) * -2);
            args.frontRightFoot.position.y = Math.round(Math.abs(Math.cos(t)) * -2);
        }

        player.duckUnit = nlerp(player.duckUnit, player.isDucking ? 1 : 0, 0.2);
        const roundedDuckUnit = Math.round(player.duckUnit * 3) / 3;

        if (roundedDuckUnit > 0.05) {
            body.position.y = Math.round(roundedDuckUnit * 4);
            args.backLeftFoot.position.x -= Math.round(roundedDuckUnit);
            args.backRightFoot.position.x -= Math.round(Math.pow(roundedDuckUnit, 2));
            args.frontLeftFoot.position.x += Math.round(Math.pow(roundedDuckUnit, 2));
            args.frontRightFoot.position.x += Math.round(roundedDuckUnit);
        }

        // if (args.moveCrestWhenDucking === undefined || args.moveCrestWhenDucking)
        // {
        //     args.crest.x = Math.round(roundedDuckUnit * 2);
        //     args.crest.y = Math.round(roundedDuckUnit * -1);
        // }

        head.position.y = Math.round(roundedDuckUnit * 2) - Math.floor(player.headLiftUnit);

        if (player.hspeed < 0)
            player.scale.x = -Math.abs(player.scale.x);
        else if (player.hspeed > 0)
            player.scale.x = Math.abs(player.scale.x);

        // TODO fubar!!
        // const tail = args.body.ext.tail;
        // Only support facing animations for Iguanas made with the character creator
        // if (!tail)
        //     return;

        // if (lastXscale !== undefined && lastXscale !== player.scale.x) {
        //     facingSteps = 10;
        // }

        // if (faceXscale === undefined)
        //     faceXscale = player.scale.x;

        // lastXscale = player.scale.x;
        // faceXscale = approachLinear(faceXscale, lastXscale, 0.2 + Math.max(0, Math.abs(player.hspeed) - 1) / 10);

        // if (facingSteps > 0) {
        //     head.position.x = -4;
        //     if (tail) {
        //         tail.x = 3;
        //     }
        //     facingSteps--;

        //     const xscale = Math.sign(faceXscale * player.scale.x);
        //     if (xscale !== 0)
        //         innerContainer.scale.x = xscale;
        // }
        // else {
        //     innerContainer.scale.x = 1;
        //     head.position.x = 0;
        //     if (tail) {
        //         tail.x = 0;
        //     }
        // }
    };

    player.step(puppetStep);

    return player;
}
