import { scnIndianaUniversityNurse } from "../scenes/scn-indiana-universtiy-nurse";
import { scnOhioDmv } from "../scenes/scn-ohio-dmv";
import { scnWorldMap } from "../scenes/scn-world-map";
import { SceneChanger } from "../systems/scene-changer";
import { DataLib } from "./data-lib";

export namespace DataRespawnConfiguration {
    export interface Model {
        sceneName: string;
        checkpointName: string;
    }

    export const { manifest, getById } = DataLib.create(
        "DataRespawnConfiguration",
        {
            Indiana: {
                sceneName: scnWorldMap.name,
                checkpointName: "restart",
            },
            ["Indiana.University.Nurse"]: {
                sceneName: scnIndianaUniversityNurse.name,
                checkpointName: "restart",
            },
            ["Ohio.Dmv"]: {
                sceneName: scnOhioDmv.name,
                checkpointName: "restart",
            },
            __Fallback__: {
                sceneName: scnWorldMap.name,
                checkpointName: "restart",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;

    export function getSceneChanger(respawnConfigurationId: Id) {
        return SceneChanger.create(getById(respawnConfigurationId));
    }
}
