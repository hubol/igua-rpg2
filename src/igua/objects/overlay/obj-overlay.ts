import { Container } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { ObjSolidOverlay, objSolidOverlay } from "../../core/scene/obj-solid-overlay";
import { ObjEnemyHealthBars, objEnemyHealthBars } from "./obj-enemy-health-bars";
import { ObjHud, objHud } from "./obj-hud";
import { ObjSystemMessage, objSystemMessage } from "./obj-system-message";
import { ObjUiInventory, objUiInventory } from "./obj-ui-inventory";

export function objOverlay() {
    const hudObj = objHud();
    const enemyHealthBarsObj = objEnemyHealthBars();
    const messages = container().named("Messages").step(self => self.y = hudObj.effectiveHeight + 3, 1);
    const dev = container().named("Dev");
    const solidObj = objSolidOverlay();
    const systemMessageObj = objSystemMessage();
    const inventoryObj = objUiInventory();

    return container(hudObj, enemyHealthBarsObj, messages, solidObj, systemMessageObj, dev, inventoryObj)
        .merge({
            hud: hudObj as Omit<ObjHud, keyof Container>,
            messages,
            dev,
            solid: solidObj as Pick<ObjSolidOverlay, "fadeIn" | "fadeOut" | "tint" | "blendMode">,
            enemyHealthBars: enemyHealthBarsObj as Pick<ObjEnemyHealthBars, "getRpgStatusEffects">,
            systemMessage: systemMessageObj as Pick<ObjSystemMessage, "setMessage">,
            inventory: inventoryObj as ObjUiInventory,
        });
}

type ObjOverlay = ReturnType<typeof objOverlay>;
export type Overlay = Omit<ObjOverlay, keyof Container>;
