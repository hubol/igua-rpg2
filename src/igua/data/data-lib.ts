import { Logger } from "../../lib/game-engine/logger";
import { ValuesOf } from "../../lib/types/values-of";

export namespace DataLib {
    export function createGetById<TModel, TManifest extends Record<"__Fallback__", TModel>>(
        { manifest, namespace }: {
            manifest: Manifest<TManifest>;
            namespace: string;
        },
    ) {
        return function getById<TId extends keyof TManifest> (id: TId): TManifest[TId] {
            const model = manifest[id];
            if (!model) {
                Logger.logContractViolationError(
                    `${namespace}.getById`,
                    new Error(`Attempted to access ${namespace}.Manifest.${String(id)}, returning fallback`),
                    { id },
                );

                // @ts-expect-error Leave me alone
                return manifest.__Fallback__;
            }

            return model;
        };
    }

    export function createManifest<TModel, TManifest extends Record<"__Fallback__", TModel>>(
        manifestWithoutIds: TManifest,
    ): Manifest<TManifest> {
        for (const id in manifestWithoutIds) {
            // @ts-expect-error Leave me alone
            manifestWithoutIds[id].id = id;
        }
        // @ts-expect-error Leave me alone
        return manifestWithoutIds;
    }

    type Manifest<T extends Record<string, unknown>> = {
        [k in keyof T]: T[k] extends object ? T[k] & { id: keyof T }
            : T[k];
    };

    export type Id<T> = Exclude<T, "__Fallback__">;

    export function createIds<TManifest extends Record<string, unknown>>(
        manifest: TManifest,
    ): Array<Id<keyof TManifest>> {
        return Object.keys(manifest).filter(id => id !== "__Fallback__") as any[];
    }

    export function createArrayOperations<TManifest extends Record<string, unknown>>(manifest: TManifest) {
        type Model = ValuesOf<TManifest>;

        const values = Object.values(manifest);

        return {
            find(predicate: (value: Model) => boolean): Model | undefined {
                return values.find(predicate as any);
            },
            filter(predicate: (value: Model) => boolean): Model[] {
                return values.filter(predicate as any);
            },
        };
    }
}
