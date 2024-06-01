import { getDefaultLooks } from "../iguana/get-default-looks";
import { createPlayerObj } from "../objects/obj-player";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";

export const OgmoEntityResolvers = {
    'Player': () => createPlayerObj(getDefaultLooks()),
    'Block': objSolidBlock,
    'Slope': objSolidSlope,
    'Pipe': objPipe,
    'PipeSlope': objPipeSlope,
}