import { DisplayObject } from "pixi.js";
import { playerObj } from "../objects/obj-player";

interface MxnCollectibleUid {
    kind: "controlled";
    readonly isCollected: boolean;
    collect: () => void;
}

interface MxnCollectibleTransient {
    kind: "transient";
}

type MxnCollectibleArgs = (MxnCollectibleUid | MxnCollectibleTransient) & {
    collectable?: boolean;
};

function isCollected(args: MxnCollectibleArgs): boolean {
    return args.kind === "transient" ? false : args.isCollected;
}

function collect(args: MxnCollectibleArgs) {
    if (args.kind === "transient") {
        return;
    }
    args.collect();
}

// TODO this is overengineered and only used by valuables...
export function mxnCollectible(obj: DisplayObject, args: MxnCollectibleArgs) {
    const initialCollected = isCollected(args);

    const collectible = obj
        .dispatches<"collected">()
        .merge({
            collectable: args.collectable === undefined ? true : args.collectable,
            collectableOnlyIfPlayerHasControl: true,
        })
        .step(self => {
            if (initialCollected) {
                return obj.destroy();
            }

            if (
                self.collectable && (playerObj.hasControl || !self.collectableOnlyIfPlayerHasControl)
                && playerObj.collides(obj)
            ) {
                collect(args);
                collectible.dispatch("collected");
                obj.destroy();
            }
        });

    if (initialCollected) {
        obj.visible = false;
    }

    return collectible;
}
