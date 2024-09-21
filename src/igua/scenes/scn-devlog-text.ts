import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { scene } from "../globals";

export function scnDevlogText() {
    // Note: To use, set renderer width/height to 1920x1080

    scene.style.backgroundTint = 0x808080;
    const c = container().at(0, 96).show();

    const title = "Collectable-once items, OGMO unique IDs";
    const date = "29 July 2024";

    const bg1 = objText.LargeBold(title, { tint: 0x000000 }).scaled(4, 4).at(32, 880).show(c);
    const bg2 = objText.Large(date, { tint: 0x000000 }).scaled(3, 3).at(32, 930).show(c);

    objText.LargeBold(title).scaled(bg1.scale).at(bg1.vcpy().add(bg1.scale, -1)).show(c);
    objText.Large(date).scaled(bg2.scale).at(bg2.vcpy().add(bg2.scale, -1)).show(c);
}
