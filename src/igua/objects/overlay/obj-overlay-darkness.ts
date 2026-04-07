import { Graphics, Rectangle } from "pixi.js";
import { renderer } from "../../current-pixi-renderer";
import { RpgDarkness } from "../../rpg/rpg-darkness";
import { playerObj } from "../obj-player";

const r = new Rectangle();

export function objOverlayDarkness() {
    return new Graphics()
        .step((self) => {
            self.clear();
            const level = RpgDarkness.getLevel();

            if (level > 0) {
                self.beginFill(0x000000).drawRect(
                    -renderer.width,
                    -renderer.height,
                    renderer.width * 3,
                    renderer.height * 3,
                );
                if (level === 1) {
                    self.beginHole().drawEllipse(
                        renderer.width / 2,
                        renderer.height / 2,
                        renderer.width / 2,
                        renderer.height / 2,
                    );
                }
                else if (level === 2 && !playerObj.destroyed) {
                    const position = playerObj.getBounds(false, r).getCenter();
                    self.beginHole().drawCircle(position.x, position.y, 64);
                }
            }
        });
}
