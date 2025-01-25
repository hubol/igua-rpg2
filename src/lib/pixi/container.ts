import { Container, DisplayObject } from "pixi.js";

export function container(...children: DisplayObject[]): Container;
export function container<TDisplayObject extends DisplayObject>(
    ...children: TDisplayObject[]
): Container<TDisplayObject>;
export function container(...children: DisplayObject[]) {
    const c = new Container();
    if (children.length) {
        c.addChild(...children);
    }
    return c;
}
