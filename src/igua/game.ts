import { Container, Graphics, Sprite } from "pixi.js";
import { wait } from "../lib/game-engine/wait";
import { Key } from "../lib/browser/key";
import { scene, sceneStack } from "./globals";
import { EscapeTickerAndExecute } from "../lib/game-engine/asshat-ticker";
import { Txs } from "../assets/textures";
import { Hitbox } from "../lib/pixi/collision";
import { merge } from "../lib/object/merge";
import { Sfx } from "../assets/sounds";
import { WarningToast } from "../lib/game-engine/warning-toast";
import { container } from "../lib/pixi/container";

export function startGame() {
    sceneStack.push(initScene, { useGameplay: false });
}

function initScene() {
    console.log('Scene', scene.source.name)

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

    const guy = merge(container(ball, pole).hitbox(Hitbox.DisplayObjects, [ ball, pole ]), { health: 1, get happiness() { return 100 + this.health; } }).at(128, 128)
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
            if (Key.justWentDown('ArrowUp')) {
                WarningToast.show('A sound', 'A sound was just played!');
                Sfx.BallBounce.with.rate(0.5 + Math.random() * 1.5).play();
            }
            if (Key.justWentDown('Space')) {
                throw new EscapeTickerAndExecute(() =>
                    sceneStack.push(initScene, { useGameplay: false }));
            }
            if (Key.justWentDown('Backspace')){
                throw new EscapeTickerAndExecute(() =>
                    sceneStack.pop());
            }
            const tint = Math.floor(Math.random() * 0xffffff);
            for (const collided of guy.collidesAll(sprites)) {
                collided.tint = tint;
            }
            if (guy.collides(s))
                s.destroy();
            if (guy.collides(smiley))
                smiley.destroy();

            guy.health += 1;
        })
        .show();

    const s2 = new Sprite(Txs.IguaRpgTitle).show();
    const s3 = new Sprite(Txs.LockedDoor).at(32, 32).show()

    const s = new Sprite(Txs.OpenDoor).at(32, 64).show()

    const sprites = [ s, s2, s3 ];

    function p(x: number, y: number) {
        const s = new Sprite(Txs.OpenDoor);
        s.scale.set(0.5, 0.5);
        return s.at(x, y);
    }

    const smiley = new Container().hitbox(Hitbox.Children).at(90, 180).show();
    smiley.scale.set(3, 2);
    smiley.addChild(p(0, 0), p(0, 50), p(10, 58), p(20, 62), p(30, 62), p(40, 58), p(50, 50), p(50, 0));

    console.log('Graphics.children.length', guy.children.length);
    console.log('Sprite.children.length', s.children.length);
    console.log('Sprite.children.length', s.getBounds());
    console.log('guy', guy);
}
