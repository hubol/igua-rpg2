import { Empty } from "../../../lib/types/empty";
import { UiStyle } from "../ui-color";
import { ObjUiPageElement } from "./obj-ui-page";

export namespace UiVerticalLayout {
    export type Element = ObjUiPageElement | typeof UiVerticalLayout.Separator;

    export const Separator = Symbol("Separator");

    export function apply(elements: Element[]): ObjUiPageElement[];
    export function apply(...elements: Element[]): ObjUiPageElement[];
    export function apply(...args: any[]) {
        const els = Empty<ObjUiPageElement>();

        const elements: Element[] = Array.isArray(args[0]) ? args[0] : args;

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
