import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Instances } from "../../../lib/game-engine/instances";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { SceneChanger } from "../../systems/scene-changer";

namespace Darkness {
    export interface Model {
        level: Integer;
        exitSceneChanger: SceneChanger;
    }
}

export function objDarkness(entity: OgmoEntities.Darkness) {
    const model: Darkness.Model = {
        level: entity.values.level,
        exitSceneChanger: SceneChanger.create({
            sceneName: entity.values.exitSceneName,
            checkpointName: entity.values.exitCheckpointName,
        }),
    };

    return container()
        .merge({ objDarkness: { model } })
        .track(objDarkness);
}

objDarkness.getDarkness = function getDarkness (): Darkness.Model | null {
    return Instances(objDarkness)[0]?.objDarkness?.model ?? null;
};
