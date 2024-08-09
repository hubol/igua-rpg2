import { DisplayObject } from "pixi.js";
import { playerObj } from "../objects/obj-player";
import { RpgProgress, RpgProgressFlags, RpgProgressUids } from "../rpg/rpg-progress";
import { DeepAccess } from "../../lib/object/deep-access";

interface MxnCollectibleUid {
    type: 'uid';
    uid: number;
    set: RpgProgressUids;
}

interface MxnCollectibleFlag {
    type: 'flag';
    flag: RpgProgressFlags;
}

interface MxnCollectibleTransient {
    type: 'transient';
}

type MxnCollectibleArgs = MxnCollectibleUid | MxnCollectibleFlag | MxnCollectibleTransient;

function isCollected(args: MxnCollectibleArgs): boolean {
    if (args.type === 'transient')
        return false;
    if (args.type === 'flag')
        return DeepAccess.get(RpgProgress.flags, args.flag);
    return RpgProgress.uids[args.set].has(args.uid);
}

function collect(args: MxnCollectibleArgs) {
    if (args.type === 'transient')
        return;
    if (args.type === 'flag')
        DeepAccess.set(RpgProgress.flags, args.flag, true);
    else
        RpgProgress.uids[args.set].add(args.uid);
}

export function mxnCollectible(obj: DisplayObject, args: MxnCollectibleArgs) {
    const initialCollected = isCollected(args);

    const collectible = obj
    .dispatches<'collected'>()
    .merge({ collectable: true })
    .step(self => {
            if (initialCollected)
                return obj.destroy();

            if (self.collectable && playerObj.hasControl && playerObj.collides(obj)) {
                collect(args);
                collectible.dispatch('collected');
                obj.destroy();
            }
        })

    if (initialCollected)
        obj.visible = false;

    return collectible;
}