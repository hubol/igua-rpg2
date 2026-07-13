import { NpcLooks } from "../../data/data-npc-looks";
import { objIguanaLocomotive } from "../obj-iguana-locomotive";

export function objAngelSkeliguana() {
    return objIguanaLocomotive(NpcLooks.Skeleton0)
        .coro(function* (self) {
            self.isSkeleton = true;
        });
}
