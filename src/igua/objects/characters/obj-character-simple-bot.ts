import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [txBody, txNoggin] = Tx.Characters.SimpleBot.split({ count: 2 });

export function objCharacterSimpleBot() {
    return container(
        Sprite.from(txBody),
        container(
            Sprite.from(txNoggin),
            objAngelMouth({
                negativeSpaceTint: 0x715AC4,
                teethCount: 3,
                toothGapWidth: 3,
                txs: objAngelMouth.txs.rounded14,
            })
                .at(40, 34),
        ),
    )
        .pivoted(42, 77)
        .mixin(mxnDetectPlayer);
}
