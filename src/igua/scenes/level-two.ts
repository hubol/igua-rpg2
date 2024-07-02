import { Lvl } from "../../assets/generated/levels/generated-level-data";

export function LevelTwo() {
    const level = Lvl.Level2();
    level.UpperDoor.locked = true;
}