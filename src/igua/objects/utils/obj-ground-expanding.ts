import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { mxnPhysics } from "../../mixins/mxn-physics";

export interface ObjGroundExpandingArgs {
    maxWidth: Integer;
    expandDirection: "left" | "right" | "both";
    expandSpeed: Integer;
}

export function objGroundExpanding(args: ObjGroundExpandingArgs) {
    let x0 = -1;
    let x1 = -1;
    let y = -1;

    const api = {
        position: {
            get x() {
                return Math.min(x0, x1);
            },
            get y() {
                return y;
            },
        },
        get width() {
            return Math.abs(x0 - x1);
        },
    };

    return container()
        .coro(function* (self) {
            const position = self.vcpy();
            self.at(0, 0);
            const leftObj = objPhysicsTest().at(position).show(self);
            const rightObj = objPhysicsTest().at(position).show(self);
            yield () => leftObj.isOnGround && rightObj.isOnGround;
            y = leftObj.y;
            x0 = leftObj.x;
            x1 = rightObj.x;
            leftObj
                .handles("moved", (self) => {
                    if (Math.abs(self.y - y) > 3 || !self.isOnGround) {
                        self.destroy();
                        return;
                    }

                    if (self.x < x0) {
                        x0 = self.x;
                    }
                });

            rightObj
                .handles("moved", (self) => {
                    if (Math.abs(self.y - y) > 3 || !self.isOnGround) {
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
            yield () => api.width >= args.maxWidth;
            leftObj.destroy();
            rightObj.destroy();
        })
        .merge({ objGroundExpanding: api });
}

function objPhysicsTest() {
    return container()
        .mixin(mxnPhysics, { gravity: 1, physicsRadius: 4, physicsOffset: [0, -4] });
}
