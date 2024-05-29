import { Sprite, Texture } from "pixi.js";
import { getDefaultLooks } from "./iguana/get-default-looks";
import { createPlayerObj } from "./objects/obj-player";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "./objects/obj-terrain";

const entityResolvers = {
    'Player': () => createPlayerObj(getDefaultLooks()),
    'Block': objSolidBlock,
    'Slope': objSolidSlope,
    'Pipe': objPipe,
    'PipeSlope': objPipeSlope,
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
        obj.scale.x = entity.width;

    if (entity.height !== undefined)
        obj.scale.y = entity.height;

    if (entity.flippedX)
        obj.scale.x *= -1;

    if (entity.flippedY)
        obj.scale.y *= -1;

    if (!obj.parent)
        obj.show();

    return obj as any;
}

interface OgmoDecal {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    originX: number;
    originY: number;
}

function createDecal(texture: Texture, decal: OgmoDecal) {
    const spr = Sprite.from(texture).at(decal.x, decal.y);
    spr.scale.set(decal.scaleX, decal.scaleY);
    spr.angle = decal.rotation;
    spr.anchor.set(decal.originX, decal.originY);
    return spr.show();
}

export const OgmoFactory = {
    entityResolvers,
    createEntity,
    createDecal,
}