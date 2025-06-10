import { Container, DisplayObject, Graphics } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { IRectangle } from "../../lib/math/rectangle";
import { CollisionShape } from "../../lib/pixi/collision";
import { ObjIndexedSprite } from "../objects/utils/obj-indexed-sprite";

interface MxnIndexedCollisionShapeArgs {
    indexedSpriteObj: ObjIndexedSprite;
    rectangles: Record<Integer, IRectangle>;
}

export function mxnIndexedCollisionShape(obj: Container, args: MxnIndexedCollisionShapeArgs) {
    const shapeObj = new Graphics().invisible();
    const shapeObjs: DisplayObject[] = [];
    let appliedIndex = -1;

    obj.addChild(shapeObj);

    return obj.collisionShape(CollisionShape.DisplayObjects, shapeObjs)
        .step(() => {
            const index = args.indexedSpriteObj.effectiveTextureIndex;

            if (index === appliedIndex) {
                return;
            }

            shapeObj.clear();

            const rectangle = args.rectangles[index];
            if (!rectangle) {
                shapeObjs.length = 0;
                return;
            }

            shapeObj.beginFill(0).drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            shapeObjs[0] = shapeObj;
        });
}
