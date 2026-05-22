import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelBoyfriends } from "../../objects/enemies/obj-angel-boyfriends";

export function scnDevAngelBoyfriends() {
    const lvl = Lvl.DummyBumpy();

    objAngelBoyfriends({
        tints: {
            angry: 0xff0000,
            sad: 0x00ff00,
            antlers: 0x0000ff,
        },
    })
        .at(lvl.Marker)
        .show();
}
