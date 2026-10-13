import { DisplayObject, Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { DramaLib } from "../drama-lib";

export function objDramaNameTag(speakerObj: DisplayObject | null) {
    const colors = DramaLib.Speaker.getColors(speakerObj);
    const name = DramaLib.Speaker.getName(speakerObj);

    const nameTextObj = objText.MediumBoldIrregular(name, { tint: colors.textSecondary });
    return container(
        new Graphics().beginFill(colors.secondary).drawRect(-4, -3, nameTextObj.width + 8, 13).mixin(
            mxnBoilPivot,
        ),
        nameTextObj,
    );
}
