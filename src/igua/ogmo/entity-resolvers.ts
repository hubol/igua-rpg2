import { createPlayerObj } from "../objects/obj-player";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";

export const OgmoEntityResolvers = {
    'Player': () => createPlayerObj().at(0, 2),
    'Block': objSolidBlock,
    'Slope': objSolidSlope,
    'Pipe': objPipe,
    'PipeSlope': objPipeSlope,
}