import { Container, Graphics, Sprite } from "pixi.js";
import { wait } from "../../lib/game-engine/wait";
import { Key } from "../../lib/browser/key";
import { scene, sceneStack } from "../globals";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { Tx } from "../../assets/textures";
import { CollisionShape } from "../../lib/pixi/collision";
import { Sfx } from "../../assets/sounds";
import { WarningToast } from "../../lib/game-engine/warning-toast";
import { container } from "../../lib/pixi/container";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { objIguanaPuppet, objIguanaHead } from "../iguana/obj-iguana-puppet";
import { iguanaPuppet } from "../iguana/iguana-puppet";
import { TextureToGraphicsConverter } from "../../lib/pixi/texture-to-graphics-converter";
import { objText } from "../../assets/fonts";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { IguanaLooks } from "../iguana/looks";
import { lerp } from "../../lib/game-engine/promise/lerp";
import { createDebugPanel } from "../../lib/game-engine/debug/debug-panel";
import { approachLinear } from "../../lib/math/number";
import { SceneLocal } from "../core/scene-local";

const TailTextures = Tx.Iguana.Tail.split({ width: 28, trimFrame: true });

const BigKeyTextures = Tx.BigKey1.split({ count: 3, trimFrame: true });

const Score = new SceneLocal(() => ({ current: 0 }));

export function SceneTest() {
    console.log('Scene', scene.source.name);

    for (const tx of BigKeyTextures) {
        new Sprite(tx).at(128, 128).show();
    }

    // for (let i = 0; i < 1280; i++) {
    //     let destroyedAt = -1;

    //     const g = new Graphics().at(i * 2, i * 2).beginFill(0xff0000 + i).drawRect(0, 0, 16, 16)
    //         .step(() => {
    //             g.x = (g.x + 1) % 256;
    //             if (g.scale.x !== 1 && Math.random() > 0.95)
    //                 g.destroy();
    //         })
    //         .async(async () => {
    //             while (true) {
    //                 let ticks = Math.random() * 60 * 4;
    //                 await wait(() => ticks-- <= 0);
    //                 if (g.destroyed)
    //                     console.log('Checking g.scale at', scene.ticker.ticks, 'destroyed at', destroyedAt);
    //                 g.scale.x = -1 + Math.random() * 2;
    //                 if (Math.random() > 0.9)
    //                     throw new Error('random');
    //             }
    //         })
    //         .async(async () => {
    //             while (true) {
    //                 let ticks = Math.random() * 60 * 4;
    //                 await wait(() => ticks-- <= 0);
    //                 destroyedAt = scene.ticker.ticks;
    //                 g.destroy();
    //             }
    //         })
    //         .show(scene.stage);
    // }

    const ball = new Graphics().beginFill(0xffff00).drawCircle(0, 0, 16);
    const pole = new Graphics().beginFill(0xff0000).drawRect(-2, -54, 4, 54);

    const prng = new PseudoRng(6924);

    const guy = container(ball, pole)
        .merge({ health: 1, get happiness() { return 100 + this.health; } })
        .collisionShape(CollisionShape.DisplayObjects, [ ball, pole ])    
        .at(128, 128)
        .step(() => {
            if (Key.isDown('ArrowUp'))
                guy.y -= 4;
            if (Key.isDown('ArrowDown')) {
                guy.y += 4;
            }
            if (Key.isDown('ArrowLeft'))
                guy.x -= 4;
            if (Key.isDown('ArrowRight'))
                guy.x += 4;
            if (Key.justWentDown('ArrowDown')) {
                WarningToast.show(prng.choose('Message 1', 'Message 2', 'Message 3'), 'description');
            }
            if (Key.justWentDown('ArrowUp')) {
                WarningToast.show('A sound', 'A sound was just played!');
                Sfx.BallBounce.with.rate(Rng.float(0.5, 2)).play();
            }
            if (Key.justWentDown('Space')) {
                Sfx.PorkRollEggAndCheese.with.rate(Rng.float(0.5, 2)).playInstance().linearRamp('rate', Rng.float(0.5, 2), Rng.float(1, 3));
                throw new EscapeTickerAndExecute(() =>
                    sceneStack.push(SceneTest, { useGameplay: false }));
            }
            if (Key.justWentDown('Backspace')){
                throw new EscapeTickerAndExecute(() =>
                    sceneStack.pop());
            }
            const tint = Math.floor(Math.random() * 0xffffff);
            for (const collided of guy.collidesAll(sprites)) {
                collided.tint = tint;
            }
            if (guy.collides(s)) {
                s.destroy();
                Score.value.current += 1;
            }
            if (guy.collides(smiley)) {
                smiley.destroy();
                Score.value.current += 1;
            }

            guy.health += 1;
        })
        .show();

    const s2 = new Sprite(Tx.IguaRpgTitle).show();
    const s3 = new Sprite(Tx.LockedDoor).at(32, 32).show()

    const s = new Sprite(Tx.OpenDoor).at(32, 64).show()

    const sprites = [ s, s2, s3 ];

    function p(x: number, y: number) {
        const s = new Sprite(Tx.OpenDoor);
        s.scale.set(0.5, 0.5);
        return s.at(x, y);
    }

    const smiley = new Container().collisionShape(CollisionShape.Children).at(90, 180).show();
    smiley.scale.set(3, 2);
    smiley.addChild(p(0, 0), p(0, 50), p(10, 58), p(20, 62), p(30, 62), p(40, 58), p(50, 50), p(50, 0));
    
    const colors = [
        0xb81f0a,
        0xebd82f,
        0x3939c4,
    ];

    TailTextures.forEach((tx, i) => {
        const sp = new Sprite(tx).tinted(colors[i % colors.length]);
        const g = new Graphics()
            .beginFill(0x000080)
            .lineStyle({ color: 0xffffff, width: 1, alignment: 1 })
            .drawRect(sp.anchor.x * -sp.width, sp.anchor.y * -sp.height, sp.width, sp.height)
            .tinted(0xffa0a0);

        container(g, sp).at(i * 32, 0).show();
    });

    new TextureToGraphicsConverter(TailTextures[1])
        .convert(new Graphics().beginFill(0x008000).lineStyle({ color: 0xffffff, width: 1, alignment: 1 }))
        .tinted(0xff0000)
        .at(200, 200)
        .show();

    const objIguanaPv = (modifyLooksFn: (looks: IguanaLooks.Serializable) => void) => {
        const looks = getDefaultLooks();
        looks.head.eyes.gap = 2;
        // looks.head.eyes.tilt = 1;
        looks.head.eyes.placement.x = 0;
        looks.head.eyes.gap = 2;
        looks.head.eyes.left.eyelid.placement = 3;
        // looks.head.eyes.right.eyelid.placement = 3;
        looks.head.eyes.right.pupil.shape = 1;
        looks.head.eyes.left.pupil.shape = 5;
        looks.head.eyes.left.pupil.color = looks.head.crest.color;
        looks.head.eyes.left.pupil.placement.x = -2;
        looks.head.eyes.right.pupil.placement.x = -2;
        // looks.head.eyes.placement.x = -3;

        // looks.head.crest.placement.x = 12;

        // looks.head.placement.x = -2;
        looks.head.placement.y = -5;

        looks.feet.gap = 3;

        looks.feet.fore.right.color = looks.feet.fore.left.claws.color;
        looks.feet.fore.right.claws.color = looks.feet.fore.left.color;

        looks.feet.hind.left.color = looks.feet.fore.left.claws.color;
        looks.feet.hind.left.claws.color = looks.feet.fore.left.color;

        // looks.head.horn.shape = 1;

        modifyLooksFn(looks);

        return objIguanaPuppet(looks)
    }

    const iguana = objIguanaPv(() => {}).at(80, 180)
    .async(async () => {
        // return;
        while (true) {
            await sleep(700);
            await lerp(iguana, 'facing').to(-iguana.facing).over(500);
            await lerp(iguana, 'ducking').to(1).over(300);
            await sleep(200);
            await lerp(iguana, 'ducking').to(0).over(300);
        }
    })
    .show();

    let walking = false;

    scene.stage.x = 0.3;

    const iguana2 = objIguanaPv(() => {}).at(180.5, 180)
    .step(() => {
        if (walking)
            iguana2.pedometer += 0.12;
        else
            iguana2.pedometer = 0;

        iguana2.x += ((walking ? 1 : 0) * iguana2.gait * 0.5 * iguana2.facing);
    })
    .async(async () => {
        while (true) {
            walking = true;
            await lerp(iguana2, 'gait').to(1).over(300);
            await sleep(2_000);
            await lerp(iguana2, 'facing').to(-iguana2.facing).over(500);
            await sleep(2_000);
            await lerp(iguana2, 'gait').to(0).over(300);
            walking = false;
            await sleep(500);
        }
    })
    .show();

    const jumperMaxY = 240;
    const jumperGravity = 0.15;
    const jumperJumpSpeed = -3;

    let jumperSpeedY = 0;
    let jumping = false;
    let jumperMovingHorizontally = false;

    const jumper = objIguanaPv(() => {}).at(32, jumperMaxY)
    .step(() => {
        if (jumping) {
            jumper.y += jumperSpeedY;
            jumperSpeedY += jumperGravity;
            if (jumper.y >= jumperMaxY) {
                jumper.y = jumperMaxY;
                jumper.landingFrames = 10;
                jumperSpeedY = 0;
                jumping = false;
            }
        }

        jumper.isAirborne = jumping;

        if (jumping) {
            // jumper.gait = 0.5;
            jumper.pedometer += 0.05;
        }
        else {
            jumper.gait = 0;
            jumper.pedometer = 0;
        }
        jumper.airborneDirectionY = approachLinear(jumper.airborneDirectionY, jumping ? -Math.sign(jumperSpeedY) : 0, jumping ? 0.15 : 0.1);

        if (jumping && jumperMovingHorizontally)
            jumper.x += 1 * jumper.facing;
    })
    .async(async () => {
        while (true) {
            await sleep(1_000);
            jumping = true;
            jumperSpeedY = jumperJumpSpeed;
            await wait(() => !jumping);
            await sleep(1_000);
            jumping = true;
            jumperSpeedY = jumperJumpSpeed;
            jumperMovingHorizontally = true;
            await wait(() => !jumping);
            jumperMovingHorizontally = false;
            await sleep(1_000);
            await lerp(jumper, 'facing').to(-jumper.facing).over(500);

        }
    })
    .show();
    
    // objIguanaPv((looks) => { looks.head.crest.placement.x = 0; looks.head.eyes.placement.x = 0; }).at(80, 212).show();

    // iguana.body.y = 3;
    // iguana.feet.foreRight.x = 1;
    // iguana.feet.foreLeft.x = 1;
    // iguana.feet.hindRight.x = -1;
    // iguana.feet.hindLeft.x = -1;
    // iguana.isFacingRight = false;
    const looks = getDefaultLooks();
    looks.head.eyes.gap = 3;
    const head = objIguanaHead(looks.head).at(128, 192).show();
    // const head2 = objIguanaHead(looks.head).at(128, 192).show();
    // head2.isFacingRight = false;
    looks.head.eyes.gap = 3;
    const head3 = objIguanaHead(looks.head).at(128, 220).show();
    head3.isFacingRight = false;
    // head.face.eyes.stepsUntilBlink = -1;
    // for (let i = 0; i < 8; i += 1)
    //     makeIguanaPuppetArgsFromLooks(getDefaultLooks()).at(164, 128 + i * 8).flipV().show();

    objText.Small('Hubol was here\nSwag!', { tint: 0x404080 }).at(65, 65).show();
    objText.Small('Hubol was here\nSwag!', { tint: 0x404080 }).at(65, 64).show();
    objText.Small('Hubol was here\nSwag!', { tint: 0xffffff }).at(64, 64).show();
    objText.Large('Hubol wagged here\n   (Swag!*)...', { tint: 0xff0040 }).at(48, 96).show();
    const o = objText.Small(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, { tint: 0xff8040, maxWidth: 256 }).at(2, 189).show(scene.root);
    o.at(0, 0)
    // objText.Small(o.text, { tint: 0xff8040, maxWidth: 256 }).at(0, 128).show(scene.root);
    objText.MediumDigits('0123456789', { tint: 0xdd7e95 }).at(64, 128).show();

    // objText.Large2(`nnonnoonoo nnannooaoo nnbnnooboo nncnnoocoo nndnnoodoo nnennooeoo nnfnnoofoo nngnnoogoo nnhnnoohoo nninnooioo nnjnnoojoo nnknnookoo nnlnnooloo nnmnnoomoo nnpnnoopoo nnqnnooqoo nnrnnooroo nnsnnoosoo nntnnootoo nnunnoouoo nnvnnoovoo nnwnnoowoo nnxnnooxoo nnynnooyoo nnznnoozoo

    // HHOHHOOHOO HHAHHOOAOO HHBHHOOBOO HHCHHOOCOO HHDHHOODOO HHEHHOOEOO HHFHHOOFOO HHGHHOOGOO HHIHHOOIOO HHJHHOOJOO HHKHHOOKOO HHLHHOOLOO HHMHHOOMOO HHNHHOONOO HHPHHOOPOO HHQHHOOQOO HHRHHOOROO HHSHHOOSOO HHTHHOOTOO HHUHHOOUOO HHVHHOOVOO HHWHHOOWOO HHXHHOOXOO HHYHHOOYOO HHZHHOOZOO
    
    // 008088088 0010088188 0020088288 0030088388 0040088488 0050088588 0060088688 0070088788 0090088988`, { maxWidth: 256 }).show(scene.root);

    // scene.stage.visible = false;

    scene.backgroundTint = 0x181050;

    objScore().at(4, 245).show();

    // document.body.appendChild(createDebugPanel(scene.stage));
}

function objScore() {
    const score = objText.LargeBold('Score: 0', { tint: 0x00ff00 })
        .step(() => score.text = `Score: ${Score.value.current}`);

    return score;
}