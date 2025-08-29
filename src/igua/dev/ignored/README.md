`dev-rpg.ts`

```ts
import { Rpg } from "../../rpg/rpg";

export function devRpg() {
    for (let i = 0; i < 4; i++) {
        Rpg.inventory.equipment.receive("PoisonRing");
    }

    Rpg.inventory.equipment.list
        .filter(equipment => equipment.name === "PoisonRing")
        .slice(0, 4)
        .forEach((equipment, index) => Rpg.inventory.equipment.equip(equipment.id, index));
}
```