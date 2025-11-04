import { scnIndianaUniversityNurse } from "../scenes/scn-indiana-universtiy-nurse";
import { scnWorldMap } from "../scenes/scn-world-map";
import { SceneChanger } from "../systems/scene-changer";
import { DataLib } from "./data-lib";

export namespace DataRespawnConfiguration {
    export interface Model {
        sceneName: string;
        checkpointName: string;
    }

    export const Manifest = DataLib.createManifest(
        {
            Indiana: {
                sceneName: scnWorldMap.name,
                checkpointName: "restart",
            },
            ["Indiana.University.Nurse"]: {
                sceneName: scnIndianaUniversityNurse.name,
                checkpointName: "restart",
            },
            __Fallback__: {
                sceneName: scnWorldMap.name,
                checkpointName: "restart",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataRespawnConfiguration" });

    export function getSceneChanger(respawnConfigurationId: Id) {
        return SceneChanger.create(getById(respawnConfigurationId))!;
    }
}
