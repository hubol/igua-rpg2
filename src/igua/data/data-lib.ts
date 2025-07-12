import { Logger } from "../../lib/game-engine/logger";

export namespace DataLib {
    export function createGetById<TModel, TManifest extends Record<"__Fallback__", TModel>>(
        { manifest, namespace }: {
            manifest: Manifest<TManifest>;
            namespace: string;
        },
    ) {
        return function getById (id: keyof TManifest) {
            const model = manifest[id];
            if (!model) {
                Logger.logContractViolationError(
                    `${namespace}.getById`,
                    new Error(`Attempted to access ${namespace}.Manifest.${String(id)}, returning fallback`),
                    { id },
                );

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
}
