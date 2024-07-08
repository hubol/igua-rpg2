import { vnew } from "../../lib/math/vector-type";
import { objDoor } from "../objects/obj-door";
import { objIntelligenceBackground } from "../objects/obj-intelligence-background";
import { createPlayerObj, playerObj } from "../objects/obj-player";
import { objSign } from "../objects/obj-sign";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";
import { objWaterDripSource } from "../objects/obj-water-drip-source";
import { RpgProgress } from "../rpg/rpg-progress";
import { OgmoFactory } from "./factory";

export const OgmoEntityResolvers = {
    'Player': (entity) => createOrConfigurePlayerObj(entity),
    'Checkpoint': (entity) => createOrConfigurePlayerObj(entity, entity.values.name),
    'Block': objSolidBlock,
    'Slope': objSolidSlope,
    'Pipe': objPipe,
    'PipeSlope': objPipeSlope,
    'Door': ({ values: { checkpointName, sceneName } }) => objDoor({ checkpointName, sceneName }),
    'WaterDripSource': ({ values: { delayMin, delayMax} }) => objWaterDripSource({ delayMin, delayMax }),
    // TODO as any feels bad, but so does stuff above
    'Sign': ({ values }) => objSign(values as any),
    'IntelligenceBackground': ({ values }) => objIntelligenceBackground(values as any),
} satisfies Record<string, (e: OgmoFactory.Entity) => unknown>

function createOrConfigurePlayerObj(entity: OgmoFactory.Entity, checkpointName?: string) {
    const pos = vnew(entity).add(entity.flippedX ? 1 : -2, 2);

    let justCreated = false;
    if (!playerObj || playerObj.destroyed) {
        createPlayerObj().show();
        justCreated = true;
    }

    if ((justCreated && !checkpointName) || (checkpointName === RpgProgress.character.position.checkpointName)) {
        playerObj.at(pos);
        playerObj.facing = entity.flippedX ? -1 : 1;
    }

    return pos;
}
