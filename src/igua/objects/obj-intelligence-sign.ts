import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { approachLinear } from "../../lib/math/number";
import { Rpg } from "../rpg/rpg";
import { playerObj } from "./obj-player";
import { objSign } from "./obj-sign";

export function objIntelligenceSign({ title, message, min, max }: OgmoEntities.IntelligenceSign["values"]) {
    const signObj = objSign({
        get title() {
            return Rpg.character.attributes.intelligence >= min ? title : "???";
        },
        get message() {
            return Rpg.character.attributes.intelligence >= min
                ? message
                : "????????????????????????????????????\n(It's impossible to read with your low intelligence)";
        },
        isSpecial: false,
    })
        .coro(function* () {
            signObj.alpha = getTargetAlpha();
        })
        .step(self => {
            signObj.alpha = approachLinear(signObj.alpha, getTargetAlpha(), 0.1);
        });

    function getTargetAlpha() {
        return (Rpg.character.attributes.intelligence >= max
                || (signObj.interact.enabled && playerObj.collides(signObj)))
            ? 1
            : 0;
    }

    return signObj;
}
