import { Container } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { ObjSolidOverlay, objSolidOverlay } from "../core/scene/obj-solid-overlay";
import { ObjHud, objHud } from "./obj-hud";

export function objOverlay() {
    const hudObj = objHud();
    const messages = container().named("Messages").step(self => self.y = hudObj.effectiveHeight + 3, 1);
    const dev = container().named("Dev");
    const solidObj = objSolidOverlay();

    return container(hudObj, messages, solidObj, dev)
        .merge({
            hud: hudObj as Omit<ObjHud, keyof Container>,
            messages,
            dev,
            solid: solidObj as Pick<ObjSolidOverlay, 'fadeIn' | 'fadeOut' | 'tint' | 'blendMode'>,
        })
}

type ObjOverlay = ReturnType<typeof objOverlay>;
export type Overlay = Omit<ObjOverlay, keyof Container>;