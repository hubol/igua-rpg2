import { Empty } from "../../../lib/types/empty";
import { UiStyle } from "../ui-color";
import { UiPageElement } from "./obj-ui-page";

export namespace UiVerticalLayout {
    export type Element = UiPageElement | typeof UiVerticalLayout.Separator;

    export const Separator = Symbol('Separator');

    export function apply(elements: Element[]): UiPageElement[]
    export function apply(...elements: Element[]): UiPageElement[]
    export function apply(...args) {
        const els = Empty<UiPageElement>();

        const elements: Element[] = Array.isArray(args[0]) ? args[0] : args;

        let y = 0;        
        for (const element of elements) {
            if (element === UiVerticalLayout.Separator) {
                y += 12;
                continue;
            }
            
            element.y = y;
            els.push(element);
            y += element.height + UiStyle.Margin;
        }

        return els;
    }
}
