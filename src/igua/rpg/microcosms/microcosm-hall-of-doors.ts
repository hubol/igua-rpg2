import { DataGift } from "../../data/data-gift";
import { SceneChanger } from "../../systems/scene-changer";
import { Rpg } from "../rpg";
import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmHallOfDoors extends RpgMicrocosm<MicrocosmHallOfDoors.State> {
    constructor(private readonly _config: MicrocosmHallOfDoors.Config) {
        super();
        this.emptySceneChanger = SceneChanger.create({ sceneName: _config.emptySceneName, checkpointName: "fromHall" });
        this.homeSceneChanger = SceneChanger.create({ sceneName: _config.homeSceneName, checkpointName: "fromDoor" });
    }

    readonly emptySceneChanger: SceneChanger;
    readonly homeSceneChanger: SceneChanger;

    getGift(index: MicrocosmHallOfDoors.Index) {
        return Rpg.gift(this._config.doorGiftIds[index]);
    }

    isComplete(index: MicrocosmHallOfDoors.Index) {
        return !this.getGift(index).isGiveable();
    }

    protected createState(): MicrocosmHallOfDoors.State {
        return {};
    }
}

export namespace MicrocosmHallOfDoors {
    export interface State {
    }

    export interface Config {
        homeSceneName: string;
        emptySceneName: string;
        doorGiftIds: [DataGift.Id, DataGift.Id, DataGift.Id, DataGift.Id];
    }

    export type Index = 0 | 1 | 2 | 3;
}
