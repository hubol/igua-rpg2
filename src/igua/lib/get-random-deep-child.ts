import { Container } from "pixi.js";
import { Rng } from "../../lib/math/rng";

export function getRandomDeepChild(obj: Container) {
    if (!obj.children.length) {
        return obj;
    }

    loop: while (true) {
        const length = obj.children.length;
        let index = Rng.int(length);
        for (let i = 0; i < length; i++) {
            const obj2 = obj.children[(index + i) % length];
            if (!obj2.visible) {
                continue;
            }
            if (!obj2.children?.length) {
                return obj;
            }
            obj = obj2 as Container;
            continue loop;
        }

        return obj;
    }
}
