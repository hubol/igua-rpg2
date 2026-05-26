import { Graphics } from "pixi.js";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelBoyfriends } from "../../objects/enemies/obj-angel-boyfriends";

export function scnDevAngelBoyfriends() {
    const lvl = Lvl.IndianaHallPainting();

    objAngelBoyfriends({
        tints: {
            angry: 0xff0000,
            sad: 0x00ff00,
            antlers: 0x0000ff,
        },
    })
        .at(lvl.BoyfriendsMarker)
        .add(100, 0)
        .show();

    // new Graphics()
    //     .beginFill(0xffffff)
    //     .drawRect(0, 0, 1, 1)
    //     .at(lvl.Marker)
    //     .show();
}
