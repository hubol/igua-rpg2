import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Input, scene } from "../globals";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { Sfx } from "../../assets/sounds";

export function scnPrommyDemo() {
    scene.style.backgroundTint = 0x808000;

    const enemy = Sprite.from(Tx.Wood.Sign)
    .step(self => {
        self.pivot.y = Math.sin(scene.ticker.ticks * 0.1) * 2;
    })
    .async(function* () {
        while (true) {
            yield sleep(300);
            Sfx.BallBounce.playInstance().rate = 1 + Math.random();
        }
    })
    .at(128, 128)
    .show();

    const player = Sprite.from(Tx.Collectibles.ValuableBlue)
    .step(() => {
        if (Input.isDown('MoveRight'))
            player.x += 4;
        if (player.collides(enemy))
            enemy.destroy();
    })
    .at(0, 128)
    .show();
}

