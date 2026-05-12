import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objProjectileCrackedEarth } from "./obj-projectile-cracked-earth";

interface ObjProjectileCrackedEarthExpandingArgs {
    attack: RpgAttack.Model;
    maxWidth: Integer;
    expandDirection: "left" | "right" | "both";
    expandSpeed: Integer;
}

export function objProjectileCrackedEarthExpanding(args: ObjProjectileCrackedEarthExpandingArgs) {
    return container()
        .coro(function* (self) {
            const position = self.vcpy();
            self.at(0, 0);
            const leftObj = objPhysicsTest().at(position).show(self);
            const rightObj = objPhysicsTest().at(position).show(self);
            yield () => leftObj.isOnGround && rightObj.isOnGround;
            const y = leftObj.y;
            let x0 = leftObj.x;
            let x1 = rightObj.x;
            leftObj
                .handles("moved", (self) => {
                    if (self.y !== y || !self.isOnGround) {
                        self.destroy();
                        return;
                    }

                    if (self.x < x0) {
                        x0 = self.x;
                    }
                });

            rightObj
                .handles("moved", (self) => {
                    if (self.y !== y || !self.isOnGround) {
                        self.destroy();
                        return;
                    }

                    if (self.x > x1) {
                        x1 = self.x;
                    }
                });
            if (args.expandDirection !== "right") {
                leftObj.speed.x = -args.expandSpeed;
            }
            if (args.expandDirection !== "left") {
                rightObj.speed.x = args.expandSpeed;
            }
            yield () => x0 !== x1;
            const earthObj = objProjectileCrackedEarth(0, args.attack)
                .step(self => {
                    const width = Math.max(0, Math.min(Math.round(Math.abs((x1 - 4) - (x0 + 4))), args.maxWidth));
                    if (self.objFxCrackedEarth.width < width) {
                        self.objFxCrackedEarth.width = width;
                        self.x = Math.min(x0 + 4, x1 - 4);
                    }
                })
                .at(x0, y)
                .show(self);
            yield () => earthObj.objFxCrackedEarth.width >= args.maxWidth;
            leftObj.destroy();
            rightObj.destroy();
        });
}

function objPhysicsTest() {
    return container()
        .mixin(mxnPhysics, { gravity: 1, physicsRadius: 4, physicsOffset: [0, -4] });
}
