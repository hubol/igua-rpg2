import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Coro } from "../../lib/game-engine/routines/coro";

export function mxnDevTest(obj: Container, program: () => Coro.Type) {
    return obj
        .coro(function* () {
            const textObj = objText.Large("RUN", { tint: 0xffff00 }).show(obj);
            try {
                yield* program();
                textObj.text = "PASS";
                textObj.tint = 0x00ff00;
            }
            catch (e) {
                console.log(e);
                textObj.text = "FAIL";
                textObj.tint = 0xff0000;
            }
        });
}
