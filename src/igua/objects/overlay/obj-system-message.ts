import { objText } from "../../../assets/fonts";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { renderer } from "../../current-pixi-renderer";

export function objSystemMessage() {
    const c = container().named("System Message").at(3, renderer.height);

    function setMessage(text: string) {
        c.removeAllChildren();
        objText.MediumIrregular(text).anchored(0, 1).coro(function* (self) {
            const yStart = self.y;
            yield interp(self, "y").steps(4).to(0).over(125);
            yield sleep(1500);
            yield interp(self, "y").steps(4).to(yStart).over(250);
            self.destroy();
        }).at(0, 16).show(c);
    }

    return c.merge({
        setMessage,
    });
}

export type ObjSystemMessage = ReturnType<typeof objSystemMessage>;
