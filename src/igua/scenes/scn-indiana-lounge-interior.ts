import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { IguaClient } from "../net/igua-client";
import { objNetGift } from "../objects/obj-net-gift";
import { objNetRoom } from "../objects/obj-net-room";

export function scnIndianaLoungeInterior(client?: IguaClient) {
    const lvl = Lvl.IndianaLoungeInterior();

    if (!client) {
        return;
    }

    objNetRoom(client).show();
    objNetGift(client).at(lvl.NetOfferMarker).show();
}
