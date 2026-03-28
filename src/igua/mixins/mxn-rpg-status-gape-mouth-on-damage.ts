import { approachLinear } from "../../lib/math/number";
import { ObjAngelMouth } from "../objects/enemies/obj-angel-mouth";
import { MxnRpgStatus } from "./mxn-rpg-status";

export function mxnRpgStatusGapeMouthOnDamage(obj: MxnRpgStatus, mouthObj: ObjAngelMouth) {
    let stepsSinceDamage = 9999;

    return obj
        .handles("damaged", (_, result) => {
            if (!result.rejected) {
                mouthObj.controls.frowning = result.damaged === true;
                mouthObj.controls.teethExposedUnit = result.damaged ? 0 : 1;
            }
            stepsSinceDamage = 0;
        })
        .step(() => {
            stepsSinceDamage++;
            mouthObj.controls.agapeUnit = approachLinear(
                mouthObj.controls.agapeUnit,
                stepsSinceDamage < 60 ? 1 : 0,
                0.1,
            );
            if (mouthObj.controls.agapeUnit === 0) {
                mouthObj.controls.frowning = false;
            }
        });
}
