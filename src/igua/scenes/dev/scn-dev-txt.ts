import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { txt } from "../../../lib/pixi/txt";
import { DataNpcLooks } from "../../data/data-npc-looks";
import { DevKey } from "../../globals";
import { objIguanaPuppet } from "../../iguana/obj-iguana-puppet";
import { objFigureInputActionControl } from "../../objects/figures/obj-figure-action-control";

export function scnDevTxt() {
    const puppetObj = objIguanaPuppet(DataNpcLooks.AlphaMale);

    objFigureInputActionControl("Confirm")
        .at(20, 20)
        .show();

    objText.MediumBold(
        txt`Press ${objFigureInputActionControl("CastSpell")} to cast a spell.

Press ${objFigureInputActionControl("InventoryMenuToggle")} to view inventory.

Press ${objFigureInputActionControl("Confirm")} to confirm.

Press ${objFigureInputActionControl("Duck")} to duck.`,
    )
        .at(100, 100)
        .coro(function* (self) {
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.text = "Ok!!";
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.text = txt`Duuuuude ${Tx.Collectibles.BallFruitTypeA}`;
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.text = txt`Text in text.
${objText.Large("Incredible fuck")}

What is the point?`;
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.destroy();
            // Should throw:
            puppetObj.x = 99;
            // (It does)
        })
        .show();
}
