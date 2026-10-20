import { DataGift } from "../../data/data-gift";
import { DataQuest } from "../../data/data-quest";
import { DramaQuests } from "../../drama/drama-quests";
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

    isDoorComplete(index: MicrocosmHallOfDoors.Index) {
        return !this.getGift(index).isGiveable();
    }

    get areDoorsComplete() {
        for (let i = 0; i < this._config.doorGiftIds.length; i++) {
            if (!this.isDoorComplete(i as MicrocosmHallOfDoors.Index)) {
                return false;
            }
        }

        return true;
    }

    get isComplete() {
        return Rpg.quest(this._config.questId).everCompleted;
    }

    *dramaComplete() {
        yield* DramaQuests.complete(this._config.questId);
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
        questId: DataQuest.Id;
    }

    export type Index = 0 | 1 | 2 | 3;
}
