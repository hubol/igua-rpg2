import { vnew } from "./vector-type";

export const Compass = {
    North: Object.freeze(vnew(0, -1)),
    NorthEast: Object.freeze(vnew(1, -1)),
    East: Object.freeze(vnew(1, 0)),
    SouthEast: Object.freeze(vnew(1, 1)),
    South: Object.freeze(vnew(0, 1)),
    SouthWest: Object.freeze(vnew(-1, 1)),
    West: Object.freeze(vnew(-1, 0)),
    NorthWest: Object.freeze(vnew(-1, -1)),
};
