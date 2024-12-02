import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { scene } from "../globals";

export function scnDevlogText() {
    // Note: To use, set renderer width/height to 1920x1080

    scene.style.backgroundTint = 0x808080;
    const c = container().at(0, 96).show();

    const title = "Infinite money glitch";
    const date = "27 November 2024";

    const seed1 = title.charCodeAt(1) * 1357;
    const seed2 = date.charCodeAt(1) * 1234;

    const bg1 = objText.Tall(title, { tint: 0x000000 }).scaled(3, 3).at(32, 880 - 19).show(c);
    const bg2 = objText.Large(date, { tint: 0x000000 }).scaled(3, 3).at(32, 930).show(c);

    const text1 = objText.Tall(title).scaled(bg1.scale).at(bg1.vcpy().add(bg1.scale, -1)).show(c);
    const text2 = objText.Large(date).scaled(bg2.scale).at(bg2.vcpy().add(bg2.scale, -1)).show(c);

    const dateTextBounds = text2.getBounds();
    const titleTextBounds = text1.getBounds();

    const width = Math.min(dateTextBounds.width + 16, titleTextBounds.width + 14);

    const gfx = new Graphics()
        .beginFill(0x000000).drawRect(
            dateTextBounds.x + 3,
            dateTextBounds.y - 4 + 3,
            width,
            3,
        )
        .beginFill(0xffffff).drawRect(
            dateTextBounds.x,
            dateTextBounds.y - 4,
            width,
            3,
        ).at(-4, -5 - 96);

    c.addChildAt(gfx, 0);

    // bg1.seed = seed1;
    // text1.seed = seed1;

    bg2.seed = seed2;
    text2.seed = seed2;
}
