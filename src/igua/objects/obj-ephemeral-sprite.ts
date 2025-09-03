import { Sprite, Texture } from "pixi.js";

export function objEphemeralSprite(txs: Texture[], textureSpeed: number) {
    return Sprite.from(txs[0])
        .merge({ index: 0, textureSpeed })
        .step(self => {
            self.index += self.textureSpeed;
            const index = Math.floor(self.index);
            if (index >= txs.length) {
                return self.destroy();
            }
            self.texture = txs[index];
        });
}
