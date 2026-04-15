import { IRenderer, Sprite, Texture, TilingSprite } from "pixi.js";
import { NoAtlasTx } from "../../../assets/no-atlas-textures";
import { Tx } from "../../../assets/textures";
import { intervalWait } from "../../../lib/browser/interval-wait";
import { DevFs } from "../../../lib/dev/dev-fs";
import { createPixiRenderer } from "../../../lib/game-engine/pixi-renderer";
import { container } from "../../../lib/pixi/container";

const panelTextures: Record<string, Texture> = {
    "Eye": Tx.Iguana.Robot.Panels.Empty,
    "Head": Tx.Iguana.Robot.Panels.Medium,
    "Pupil": Tx.Iguana.Robot.Panels.Empty,
    "Mouth": Tx.Iguana.Robot.Panels.Empty,
    "Nails": Tx.Iguana.Robot.Panels.VerticalTight,
    "Club": Tx.Iguana.Robot.Panels.HorizontalTight,
    "Horn": Tx.Iguana.Robot.Panels.HorizontalTight,
    "Foot": Tx.Iguana.Robot.Panels.HorizontalTight,
};

export function scnDevGenerateRoboticIguanas() {
    const textures = [
        { path: "/", txs: Tx.Iguana },
        { path: "/boiled/", txs: Tx.Iguana.Boiled },
    ]
        .flatMap(({ path, txs }) =>
            Object.entries(txs).flatMap(([key, tx]) => {
                if (!(tx instanceof Texture)) {
                    return [];
                }

                return [{ key, path: path + key.toLowerCase(), tx }];
            })
        );

    setTimeout(async () => {
        for (const { key, path, tx } of textures) {
            const renderer = createPixiRenderer({
                width: tx.width,
                height: tx.height,
                eventFeatures: { click: false, globalMove: false, move: false, wheel: false },
                eventMode: "none",
                backgroundAlpha: 0,
            });

            const obj = container(Sprite.from(tx).tinted(0xffffff));
            const panelTx = panelTextures[key] ?? NoAtlasTx.Iguana.Robot.Panels.Large;
            new TilingSprite(panelTx, tx.width, tx.height)
                .tinted(0xffffff)
                .masked(Sprite.from(tx))
                .show(obj);
            renderer.render(obj);

            const blob = await getPngBlob(renderer);
            renderer.destroy();
            await DevFs.write("raw/textures/iguana/robot" + path + ".png", blob);
        }
    });
}

async function getPngBlob(renderer: IRenderer<HTMLCanvasElement>) {
    return new Promise<Blob>(resolve => {
        renderer.view.toBlob(blob => resolve(blob!), "image/png");
    });
}
