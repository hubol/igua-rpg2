import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { objAngelSkeliguana } from "../objects/enemies/obj-angel-skeliguana";

export function scnDungeonBones() {
    const lvl = Lvl.DungeonBones();

    objAngelSkeliguana().at(lvl.Marker).show();
}
