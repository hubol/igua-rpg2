import { DisplayObject } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { DeepAccess } from "../../lib/object/deep-access";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgProgressFlags } from "../rpg/rpg-progress";

interface MxnCollectibleUid {
    kind: "uid";
    uid: Integer;
    set: Set<Integer>;
}

interface MxnCollectibleFlag {
    kind: "flag";
    flag: RpgProgressFlags;
}

interface MxnCollectibleTransient {
    kind: "transient";
}

type MxnCollectibleArgs = (MxnCollectibleUid | MxnCollectibleFlag | MxnCollectibleTransient) & {
    collectable?: boolean;
};

function isCollected(args: MxnCollectibleArgs): boolean {
    if (args.kind === "transient") {
        return false;
    }
    if (args.kind === "flag") {
        return DeepAccess.get(Rpg.flags, args.flag);
    }
    return args.set.has(args.uid);
}

function collect(args: MxnCollectibleArgs) {
    if (args.kind === "transient") {
        return;
    }
    if (args.kind === "flag") {
        DeepAccess.set(Rpg.flags, args.flag, true);
    }
    else {
        args.set.add(args.uid);
    }
}

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
