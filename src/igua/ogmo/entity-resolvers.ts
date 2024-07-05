import { objDoor } from "../objects/obj-door";
import { createPlayerObj } from "../objects/obj-player";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";
import { OgmoFactory } from "./factory";

export const OgmoEntityResolvers = {
    'Player': (entity) => {
        const obj = createPlayerObj().at(0, 2);
        if (entity.flippedX) {
            obj.x += 1;
            obj.facing = -1;
            delete entity.flippedX;
        }
        else {
            obj.x -= 2;
        }
        return obj;
    },
    'Block': objSolidBlock,
    'Slope': objSolidSlope,
    'Pipe': objPipe,
    'PipeSlope': objPipeSlope,
    'Door': ({ values: { checkpointName, sceneName } }) => objDoor({ checkpointName, sceneName }),
} satisfies Record<string, (e: OgmoFactory.Entity) => unknown>