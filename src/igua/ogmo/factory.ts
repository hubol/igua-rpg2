import { Container, DisplayObject, Sprite, Texture } from "pixi.js";
import { OgmoProject } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Logger } from "../../lib/game-engine/logger";
import { container } from "../../lib/pixi/container";
import { scene } from "../globals";
import { ogmoAddToLayer } from "./add-to-layer";

export namespace OgmoFactory {
    interface EntityBase {
        x: number;
        y: number;
        uid?: number;
        flippedX?: boolean;
        flippedY?: boolean;
        width?: number;
        height?: number;
        rotation?: number;
        tint?: number;
    }

    export interface Entity<TEntityName extends OgmoProject.Entities.Names> extends EntityBase {
        values: OgmoProject.Entities.Values[TEntityName];
    }

    export interface EntityCommon extends EntityBase {
        values: EntityCommonValues & Record<string, any>;
    }

    interface EntityCommonValues {
        name: string;
        depth: number;
        visible?: boolean;
    }

    export interface Decal {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        originX: number;
        originY: number;
        groupName?: string;
        tint?: number;
    }

    export interface Level {
        width: number;
        height: number;
        backgroundTint: number;
    }

    export function createEntity<TFn extends (...args: any[]) => any>(
        fn: TFn,
        entity: OgmoFactory.EntityCommon,
        layerName: string,
    ): ReturnType<TFn> {
        if (typeof fn !== "function") {
            Logger.logContractViolationError(
                "OgmoFactory",
                new Error("Received fn argument that is not a function. Is OgmoEntityResolvers up to date?"),
                { fn },
            );
            return undefined as any;
        }

        const obj: Sprite = fn(entity);

        if (!(obj instanceof DisplayObject)) {
            return obj;
        }

        obj.add(entity);

        if (entity.width !== undefined) {
            obj.scale.x = entity.width;
        }

        if (entity.height !== undefined) {
            obj.scale.y = entity.height;
        }

        if (entity.flippedX) {
            obj.scale.x *= -1;
        }

        if (entity.flippedY) {
            obj.scale.y *= -1;
        }

        if (entity.rotation !== undefined) {
            obj.angle = entity.rotation;
        }

        if (entity.tint !== undefined) {
            obj.tint = entity.tint;
        }

        if (entity.values.visible === false) {
            obj.visible = false;
        }

        ogmoAddToLayer(obj, layerName);

        return obj as any;
    }

    const decalGroups = new Map<string, Container>();

    export function createDecal(texture: Texture, decal: OgmoFactory.Decal, layerName: string) {
        const spr = Sprite.from(texture).at(decal.x, decal.y).track(createDecal);
        spr.scale.set(decal.scaleX, decal.scaleY);
        spr.angle = decal.rotation;
        spr.anchor.set(decal.originX, decal.originY);

        if (decal.tint !== undefined) {
            spr.tint = decal.tint;
        }

        if (decal.groupName) {
            const decalGroup = decalGroups.get(decal.groupName);
            if (!decalGroup) {
                Logger.logContractViolationError(
                    "createDecal",
                    new Error(`Could not find Decal Group with name: ${decal.groupName}`),
                );
            }
            else {
                decalGroup.addChild(spr);
            }
        }

        ogmoAddToLayer(spr, layerName);

        return spr;
    }

    export function createDecalGroup(groupName: string, layerName: string) {
        const obj = (container() as Container<Sprite>).named(`Decal Group: ${groupName}`).merge({ groupName });

        if (decalGroups.has(groupName)) {
            Logger.logContractViolationError(
                "createDecalGroup",
                new Error(`createDecalGroup called when decalGroup already exists with groupName: ${groupName}`),
                { decalGroup: decalGroups.get(groupName) },
            );
        }
        decalGroups.set(groupName, obj);

        ogmoAddToLayer(obj, layerName);

        return obj;
    }

    export function createLevel<TFn extends (...args: any[]) => any>(level: OgmoFactory.Level, fn: TFn): TFn {
        return (() => {
            scene.level.width = level.width;
            scene.level.height = level.height;
            scene.style.backgroundTint = level.backgroundTint;
            decalGroups.clear();
            const result = fn();
            decalGroups.clear();
            return result;
        }) as TFn;
    }
}
