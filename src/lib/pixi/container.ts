import { Container, DisplayObject } from "pixi.js";

export function container(...children: DisplayObject[]) {
    const c = new Container();
    c.addChild(...children);
    return c;
}