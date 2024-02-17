import { Graphics } from "pixi.js";
import { Rng } from "../../lib/math/rng";
// import { objText } from "../../assets/fonts";
// import { tickProcessingTime } from "../launch/prepare-game-engine";
import { sleep } from "../../lib/game-engine/promise/sleep";

export function BindTest() {
    for (let i = 0; i < 1024 * 4; i++)
        objTest().show();

//     let samples = 0;
//     let total = 0;

//     let min = Number.MAX_SAFE_INTEGER;
//     let max = Number.MIN_SAFE_INTEGER;
//     let avg = 0;

//     const text = objText.Large('', { tint: 0x00ff00 })
//         .step(() => {
//             total += tickProcessingTime;
//             samples += 1;

//             min = Math.min(min, tickProcessingTime);
//             max = Math.max(max, tickProcessingTime);
//             avg = total / samples;

//             text.text = `Min: ${min}
// Max: ${max}
// Avg: ${avg}`
//         })
//         .show();
        
}

function objTest() {
    let value = 0;
    
    return new Graphics().beginFill(Rng.intc(0xffffff)).drawRect(0, 0, 16, 16)
        .at(Rng.int(240), Rng.int(240))
        .step(g => {
            if (Rng.bool())
                g.x += 1;
            if (Rng.bool())
                g.y += 1;
            if (Rng.bool())
                g.x -= 1;
            if (Rng.bool())
                g.y -= 1;
            value += Rng.float(-1, 1);
            if (Rng.bool())
                g.angle = value;
        })
        .async(async g => {
            while (true) {
                await sleep(Rng.int(1000, 3000));
                g.scale.y = 2;
                await sleep(Rng.int(1000, 3000));
                g.scale.y = 1;
            }
        })
}