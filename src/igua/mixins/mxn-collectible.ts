import { DisplayObject } from "pixi.js";
import { DeepAccess } from "../../lib/object/deep-access";
import { playerObj } from "../objects/obj-player";
import { RpgProgress, RpgProgressFlags, RpgProgressUids } from "../rpg/rpg-progress";

interface MxnCollectibleUid {
    kind: "uid";
    uid: number;
    set: RpgProgressUids;
}

interface MxnCollectibleFlag {
    kind: "flag";
    flag: RpgProgressFlags;
}

interface MxnCollectibleTransient {
    kind: "transient";
}

type MxnCollectibleArgs = MxnCollectibleUid | MxnCollectibleFlag | MxnCollectibleTransient;

function isCollected(args: MxnCollectibleArgs): boolean {
    if (args.kind === "transient") {
        return false;
    }
    if (args.kind === "flag") {
        return DeepAccess.get(RpgProgress.flags, args.flag);
    }
    return RpgProgress.uids[args.set].has(args.uid);
}

function collect(args: MxnCollectibleArgs) {
    if (args.kind === "transient") {
        return;
    }
    if (args.kind === "flag") {
        DeepAccess.set(RpgProgress.flags, args.flag, true);
    }
    else {
        RpgProgress.uids[args.set].add(args.uid);
    }
}

export function mxnCollectible(obj: DisplayObject, args: MxnCollectibleArgs) {
    const initialCollected = isCollected(args);

    const collectible = obj
        .dispatches<"collected">()
        .merge({ collectable: true, collectableOnlyIfPlayerHasControl: true })
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
