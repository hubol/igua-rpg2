import { container } from "../../../lib/pixi/container";
import { mxnRpgAttack, MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { objGroundExpanding, ObjGroundExpandingArgs } from "../utils/obj-ground-expanding";
import { objProjectileCrackedEarth } from "./obj-projectile-cracked-earth";

interface ObjProjectileCrackedEarthExpandingArgs extends MxnRpgAttackArgs, ObjGroundExpandingArgs {
}

export function objProjectileCrackedEarthExpanding(args: ObjProjectileCrackedEarthExpandingArgs) {
    return container()
        .coro(function* (self) {
            const position = self.vcpy();
            self.at(0, 0);

            const expandingObj = objGroundExpanding(args).at(position).show(self);

            yield () => expandingObj.objGroundExpanding.width > 0;

            objProjectileCrackedEarth(0)
                .mixin(mxnRpgAttack, args)
                .step(self => {
                    const width = Math.max(0, Math.min(expandingObj.objGroundExpanding.width + 8, args.maxWidth));
                    if (self.objFxCrackedEarth.width < width) {
                        self.objFxCrackedEarth.width = width;
                        self.x = expandingObj.objGroundExpanding.position.x - 4;
                    }
                })
                .at(expandingObj.objGroundExpanding.position)
                .show(self);
        });
}
