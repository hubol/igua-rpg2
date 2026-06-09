import { Logger } from "../../lib/game-engine/logger";
import { ValuesOf } from "../../lib/types/values-of";

export namespace DataLib {
    export function create<TManifest extends Record<"__Fallback__", unknown>>(
        namespace: string,
        rawManifest: TManifest,
    ) {
        for (const id in rawManifest) {
            // @ts-expect-error Leave me alone
            rawManifest[id].id = id;
        }

        type ThisManifest = Manifest<Omit<TManifest, "__Fallback__">>;
        type ThisId = keyof ThisManifest;
        type ThisModel = ValuesOf<ThisManifest>;

        // @ts-expect-error It's ok
        const manifest: ThisManifest = rawManifest;
        // @ts-expect-error It's ok
        const ids = Object.keys(rawManifest).filter(id => id !== "__Fallback__") as ReadonlyArray<ThisId>;
        const noFallbackValues = Object.values(manifest).filter(item =>
            (item as Record<string, string>).id !== "__Fallback__"
        );

        function getById<TId extends ThisId>(id: TId): TManifest[TId] {
            const model = rawManifest[id];
            if (!model) {
                Logger.logContractViolationError(
                    `${namespace}.getById`,
                    new Error(`Attempted to access ${namespace}.manifest.${String(id)}, returning fallback`),
                    { id },
                );

                const fallback = rawManifest.__Fallback__;
                // @ts-expect-error Leave me alone
                return fallback;
            }

            return model;
        }

        return {
            find(predicate: (value: ThisModel) => boolean): ThisModel | undefined {
                return noFallbackValues.find(predicate as any);
            },
            filter(predicate: (value: ThisModel) => boolean): ThisModel[] {
                return noFallbackValues.filter(predicate as any);
            },
            map<T>(transform: (value: ThisModel) => T): T[] {
                return noFallbackValues.map(transform as any);
            },
            getById,
            ids,
            manifest,
        };
    }

    type Manifest<T extends Record<string, unknown>> = {
        [k in keyof T]: T[k] extends object ? T[k] & { id: keyof T }
            : T[k];
    };

    export type Id<T> = Exclude<keyof T, "__Fallback__">;
    export type Type<T> = T[Id<T>];
}
