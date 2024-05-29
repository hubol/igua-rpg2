import { Sprite } from "pixi.js";
import { getDefaultLooks } from "./iguana/get-default-looks";
import { createPlayerObj } from "./objects/obj-player";
import { objSolidBlock, objSolidSlope } from "./objects/obj-terrain";

const entityResolvers = {
    'Player': () => createPlayerObj(getDefaultLooks()),
    'Block': objSolidBlock,
    'Slope': objSolidSlope,
}

interface OgmoEntity {
    x: number;
    y: number;
    flippedX?: boolean;
    flippedY?: boolean;
    width?: number;
    height?: number;
    values: OgmoEntityValues;
}

interface OgmoEntityValues {
    name: string;
    depth: number;
}

function createEntity<TFn extends (...args: any[]) => any>(fn: TFn, entity: OgmoEntity): ReturnType<TFn> {
    const obj: Sprite = fn();
    obj.at(entity);

    if (entity.width !== undefined)
        obj.width = entity.width;

    if (entity.height !== undefined)
        obj.height = entity.height;

    if (entity.flippedX)
        obj.scale.x *= -1;

    if (entity.flippedY)
        obj.scale.y *= -1;

    if (!obj.parent)
        obj.show();

    return obj as any;
}

export const OgmoFactory = {
    entityResolvers,
    createEntity,
}