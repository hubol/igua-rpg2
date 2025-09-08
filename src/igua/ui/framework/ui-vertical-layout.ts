import { Container } from "pixi.js";
import { Empty } from "../../../lib/types/empty";
import { UiStyle } from "../ui-color";
import { ObjUiPageElement } from "./obj-ui-page";

export namespace UiVerticalLayout {
    export type Element<T extends Container = ObjUiPageElement> = T | typeof UiVerticalLayout.Separator;

    export const Separator = Symbol("Separator");

    export function apply<TElement extends Container = ObjUiPageElement>(elements: Element<TElement>[]): TElement[];
    export function apply<TElement extends Container = ObjUiPageElement>(...elements: Element<TElement>[]): TElement[];
    export function apply(...args: any[]) {
        const els = Empty<unknown>();

        const elements: Array<Container | typeof Separator> = Array.isArray(args[0]) ? args[0] : args;

        let y = 0;
        for (const element of elements) {
            if (element === UiVerticalLayout.Separator) {
                y += 12;
                continue;
            }

            element.y = y;
            els.push(element);
            y += Math.round(element.height) + UiStyle.Margin;
        }

        return els;
    }
}
