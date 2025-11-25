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
    const solidObjBelowMessages = objSolidOverlay();
    const solidObjAboveMessages = objSolidOverlay();
    const systemMessageObj = objSystemMessage();
    const inventoryObj = objUiInventory();

    return container(
        hudObj,
        enemyHealthBarsObj,
        solidObjBelowMessages,
        messages,
        solidObjAboveMessages,
        systemMessageObj,
        dev,
        inventoryObj,
    )
        .merge({
            hud: hudObj as Omit<ObjHud, keyof Container>,
            messages,
            dev,
            solidBelowMessages: solidObjBelowMessages as Pick<
                ObjSolidOverlay,
                "fadeIn" | "fadeOut" | "tint" | "blendMode"
            >,
            solid: solidObjAboveMessages as Pick<ObjSolidOverlay, "fadeIn" | "fadeOut" | "tint" | "blendMode">,
            enemyHealthBars: enemyHealthBarsObj as Pick<ObjEnemyHealthBars, "getRpgStatusEffects">,
            systemMessage: systemMessageObj as Pick<ObjSystemMessage, "setMessage">,
            inventory: inventoryObj as ObjUiInventory,
        });
}

export type ObjOverlay = ReturnType<typeof objOverlay>;
