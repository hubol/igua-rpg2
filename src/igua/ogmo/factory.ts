import { Container, DisplayObject, Sprite, Texture } from "pixi.js";
import { scene } from "../globals";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { ogmoAddToLayer } from "./add-to-layer";
import { container } from "../../lib/pixi/container";

export namespace OgmoFactory {
    export interface Entity {
        x: number;
        y: number;
        uid?: number;
        flippedX?: boolean;
        flippedY?: boolean;
        width?: number;
        height?: number;
        tint?: number;
        values: EntityValues & Record<string, any>;
    }

    interface EntityValues {
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
        entity: OgmoFactory.Entity,
        layerName: string,
    ): ReturnType<TFn> {
        if (typeof fn !== "function") {
            ErrorReporter.reportSubsystemError(
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
        const spr = Sprite.from(texture).at(decal.x, decal.y);
        spr.scale.set(decal.scaleX, decal.scaleY);
        spr.angle = decal.rotation;
        spr.anchor.set(decal.originX, decal.originY);

        if (decal.tint !== undefined) {
            spr.tint = decal.tint;
        }

        if (decal.groupName) {
            const decalGroup = decalGroups.get(decal.groupName);
            if (!decalGroup) {
                // TODO plz figure out how to classify error severity
                ErrorReporter.reportSubsystemError(
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
        const obj = container().named(`Decal Group: ${groupName}`).merge({ groupName });

        if (decalGroups.has(groupName)) {
            ErrorReporter.reportSubsystemError(
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
