import { Graphics, TilingSprite } from "pixi.js";
import { NoAtlasTx } from "../../../assets/no-atlas-textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";

export function objProjectileSnowAoe(radius: Integer) {
    const collisionObj = container(
        new Graphics().beginFill(0xff0000).drawRect(-0.9, -0.3, 1.8, 0.6),
        new Graphics().beginFill(0xff0000).drawRect(-0.65, -0.65, 1.3, 1.3),
        new Graphics().beginFill(0xff0000).drawRect(-0.3, -0.9, 0.6, 1.8),
    )
        .invisible();

    const snowMaskObj = new Graphics().beginFill(0xff0000).drawCircle(0, 0, 1);
    const edgeMaskObj = new Graphics().beginFill(0xff0000).drawCircle(0, 0, 1);

    const snowObj = new TilingSprite(NoAtlasTx.Enemy.Snow.Aoe).masked(snowMaskObj);
    const edgeObj = new TilingSprite(NoAtlasTx.Enemy.Snow.Aoe).masked(edgeMaskObj);

    edgeObj.alpha = 0.3;

    let appliedRadius = Null<number>();

    const api = {
        get radius() {
            return radius;
        },
        set radius(value) {
            radius = value;
            if (appliedRadius === radius) {
                return;
            }

            snowObj.width = Math.max(0, Math.round(radius * 2 - 12));
            snowObj.height = snowObj.width;
            snowObj.position.set(Math.round(snowObj.width / -2));

            edgeObj.width = Math.max(0, radius * 2);
            edgeObj.height = edgeObj.width;
            edgeObj.position.set(Math.round(edgeObj.width / -2));

            snowMaskObj.scale.set(Math.max(0, radius - 6));
            edgeMaskObj.scale.set(radius);

            collisionObj.scale.set(radius);
            appliedRadius = radius;
        },
    };

    api.radius = radius;

    const tilePositionX = Rng.int(-128, 128);
    let stepsCount = 0;

    return container(
        edgeObj,
        snowObj,
        snowMaskObj,
        edgeMaskObj,
        collisionObj,
    )
        .collisionShape(CollisionShape.DisplayObjects, collisionObj.children)
        .merge({ objProjectileSnowAoe: api })
        .step(() => {
            stepsCount++;
            snowObj.tilePosition.at(Math.round(Math.sin(stepsCount / 8) * 2) + tilePositionX, stepsCount);
            edgeObj.tilePosition.at(snowObj.tilePosition.x + 6, snowObj.tilePosition.y + 6);
        });
}
