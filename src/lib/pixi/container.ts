import { Container, DisplayObject } from "pixi.js";

export function container(...children: DisplayObject[]) {
    const c = new Container();
    if (children.length) {
        c.addChild(...children);
    }
    return c;
}
