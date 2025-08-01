import { Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";

interface ObjTransitionedSpriteArgs {
    txProvider: () => Texture | null;
    anchorProvider: (tx: Texture) => VectorSimple;
}

const r = new Rectangle();

const nullTexture = new Texture(Tx.Placeholder.baseTexture);

export function objTransitionedSprite({ anchorProvider, txProvider }: ObjTransitionedSpriteArgs) {
    const mask = new Graphics();

    const sprite = new Sprite().masked(mask);

    function updateSprite(texture: Texture | null) {
        if (!texture) {
            sprite.visible = false;
            sprite.texture = nullTexture;
            return;
        }

        sprite.texture = texture;
        sprite.anchored(anchorProvider(texture));
        sprite.visible = true;

        const b = sprite.getLocalBounds(r);
        mask
            .clear().beginFill(0xffffff).drawRect(b.x, b.y, b.width, b.height);

        console.log(b.x, b.y, b.width, b.height);
    }

    updateSprite(txProvider());

    return container(sprite, mask)
        .coro(function* () {
            while (true) {
                yield () => (txProvider() ?? nullTexture) !== sprite.texture;
                yield interp(mask.scale, "y").steps(4).to(0).over(250);
                updateSprite(txProvider());
                yield interp(mask.scale, "y").steps(5).to(1).over(250);
            }
        });
}
