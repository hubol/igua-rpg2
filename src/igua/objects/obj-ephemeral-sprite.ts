import { Sprite, Texture } from "pixi.js";

export function objEphemeralSprite(txs: Texture[], speed: number) {
    return Sprite.from(txs[0])
        .merge({ index: 0, speed })
        .step(self => {
            self.index += self.speed;
            const index = Math.floor(self.index);
            if (index >= txs.length) {
                return self.destroy();
            }
            self.texture = txs[index];
        });
}
