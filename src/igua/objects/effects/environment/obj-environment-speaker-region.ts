import { Graphics } from "pixi.js";
import { OgmoEntities } from "../../../../assets/generated/levels/generated-ogmo-project-data";
import { StringConvert } from "../../../../lib/string/string-convert";
import { mxnShow } from "../../../mixins/mxn-show";
import { mxnSpeaker } from "../../../mixins/mxn-speaker";

export function objEnvironmentSpeakerRegion(
    { tint, values: { messages, speakerName, speakerTintSecondary } }: OgmoEntities.EnvironmentSpeakerRegion,
) {
    return new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 1, 1)
        .invisible()
        .mixin(mxnSpeaker, {
            name: speakerName,
            tintPrimary: tint!,
            tintSecondary: StringConvert.toRgbInt(speakerTintSecondary),
        })
        .mixin(mxnShow, ...messages.split("%next%"));
}
