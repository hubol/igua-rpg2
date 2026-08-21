import { Assert } from "../../../lib/assert";
import { KeyCode, KeyListener } from "../../../lib/browser/key-listener";
import { container } from "../../../lib/pixi/container";
import { mxnDevTest } from "../../mixins/mxn-dev-test";

export function scnDevTestKeyboard() {
    const key = new KeyListener();
    key.start();

    const code: KeyCode = "ArrowRight";

    function simulate(type: "keydown" | "keyup") {
        const event = new KeyboardEvent(type, { code });
        document.dispatchEvent(event);
    }

    function tick() {
        key.tick();
    }

    function check(...attributes: Array<"isDown" | "isUp" | "justWentDown" | "justWentUp">) {
        const expected = {
            isDown: attributes.includes("isDown"),
            isUp: attributes.includes("isUp"),
            justWentDown: attributes.includes("justWentDown"),
            justWentUp: attributes.includes("justWentUp"),
        };

        Assert({
            isDown: Boolean(key.isDown(code)),
            isUp: Boolean(key.isUp(code)),
            justWentDown: Boolean(key.justWentDown(code)),
            justWentUp: Boolean(key.justWentUp(code)),
        })
            .toSerializeTo(expected);
    }

    container()
        .at(90, 90)
        .mixin(mxnDevTest, function* () {
            simulate("keydown");
            check("isDown", "justWentDown");
            tick();

            check("isDown");
            tick();

            simulate("keyup");
            check("isUp", "justWentUp");
            tick();

            check("isUp");
            tick();

            simulate("keydown");
            simulate("keyup");
            check("isDown", "justWentUp", "justWentDown");
            tick();

            check("isUp");
        })
        .show();
}
