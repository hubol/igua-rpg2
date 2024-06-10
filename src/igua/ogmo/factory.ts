import { Sprite, Texture } from "pixi.js";
import { scene } from "../globals";

namespace OgmoFactory {
    export interface Entity {
        x: number;
        y: number;
        flippedX?: boolean;
        flippedY?: boolean;
        width?: number;
        height?: number;
        values: EntityValues;
    }    

    interface EntityValues {
        name: string;
        depth: number;
    }

    export interface Decal {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        originX: number;
        originY: number;
    }

    export interface Level {
        width: number;
        height: number;
    }
}

function createEntity<TFn extends (...args: any[]) => any>(fn: TFn, entity: OgmoFactory.Entity): ReturnType<TFn> {
    const obj: Sprite = fn();
    obj.add(entity);

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

function createDecal(texture: Texture, decal: OgmoFactory.Decal) {
    const spr = Sprite.from(texture).at(decal.x, decal.y);
    spr.scale.set(decal.scaleX, decal.scaleY);
    spr.angle = decal.rotation;
    spr.anchor.set(decal.originX, decal.originY);
    return spr.show();
}

function createLevel<TFn extends (...args: any[]) => any>(level: OgmoFactory.Level, fn: TFn): TFn {
    return (() => {
        scene.level.width = level.width;
        scene.level.height = level.height;
        return fn();
    }) as TFn;
}

export const OgmoFactory = {
    createEntity,
    createDecal,
    createLevel,
}