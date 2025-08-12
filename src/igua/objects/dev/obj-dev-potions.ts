import { objText } from "../../../assets/fonts";
import { DevKey } from "../../globals";
import { Rpg } from "../../rpg/rpg";

export function objDevPotions() {
    objText.Medium("")
        .step(self => {
            if (DevKey.justWentDown("KeyQ")) {
                Rpg.inventory.potions.receive("AttributeHealthUp");
            }
            if (DevKey.justWentDown("KeyW")) {
                Rpg.inventory.potions.receive("AttributeIntelligenceUp");
            }
            if (DevKey.justWentDown("KeyE")) {
                Rpg.inventory.potions.receive("AttributeStrengthUp");
            }
            if (DevKey.justWentDown("KeyR")) {
                Rpg.inventory.potions.receive("Poison");
            }
            if (DevKey.justWentDown("KeyT")) {
                Rpg.inventory.potions.receive("PoisonRestore");
            }
            if (DevKey.justWentDown("KeyY")) {
                Rpg.inventory.potions.receive("RestoreHealth");
            }

            if (DevKey.justWentDown("Digit1")) {
                Rpg.inventory.potions.use(0);
            }
            if (DevKey.justWentDown("Digit2")) {
                Rpg.inventory.potions.use(1);
            }
            if (DevKey.justWentDown("Digit3")) {
                Rpg.inventory.potions.use(2);
            }
            if (DevKey.justWentDown("Digit4")) {
                Rpg.inventory.potions.use(3);
            }
            if (DevKey.justWentDown("Digit5")) {
                Rpg.inventory.potions.use(4);
            }
            if (DevKey.justWentDown("Digit6")) {
                Rpg.inventory.potions.use(5);
            }
            if (DevKey.justWentDown("Digit7")) {
                Rpg.inventory.potions.use(6);
            }
            if (DevKey.justWentDown("Digit8")) {
                Rpg.inventory.potions.use(7);
            }
            if (DevKey.justWentDown("Digit9")) {
                Rpg.inventory.potions.use(8);
            }
            if (DevKey.justWentDown("Digit0")) {
                Rpg.inventory.potions.use(9);
            }

            self.text = Rpg.inventory.potions.list.join("\n") + "\nExcess:"
                + Rpg.inventory.potions.excessList.join("\n");
        })
        .show();
}
