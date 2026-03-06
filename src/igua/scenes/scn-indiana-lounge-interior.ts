import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { IguaClient } from "../net/igua-client";
import { objNetGift } from "../objects/obj-net-gift";
import { objNetRoom } from "../objects/obj-net-room";
import { SceneChanger } from "../systems/scene-changer";
import { scnIndianaLoungeExterior } from "./scn-indiana-lounge-exterior";

export function scnIndianaLoungeInterior(client?: IguaClient) {
    const lvl = Lvl.IndianaLoungeInterior();

    if (!client) {
        return;
    }

    const offlineSceneChanger = SceneChanger.create({
        sceneName: scnIndianaLoungeExterior.name,
        checkpointName: "fromLoungeOffline",
    })!;
    objNetRoom(client, offlineSceneChanger).show();
    objNetGift(client).at(lvl.NetOfferMarker).show();
}
