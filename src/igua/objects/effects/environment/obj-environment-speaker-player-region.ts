import { Graphics } from "pixi.js";
import { OgmoEntities } from "../../../../assets/generated/levels/generated-ogmo-project-data";
import { show } from "../../../drama/show";
import { Cutscene } from "../../../globals";
import { mxnCutscene } from "../../../mixins/mxn-cutscene";
import { playerObj } from "../../obj-player";

export function objEnvironmentSpeakerPlayerRegion(
    { values: { messages } }: OgmoEntities.EnvironmentSpeakerPlayerRegion,
) {
    const splitMessages = messages.split("%next%");
    return new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 1, 1)
        .invisible()
        .mixin(mxnCutscene, function* () {
            Cutscene.setCurrentSpeaker(playerObj);
            yield* show(...splitMessages);
        });
}
