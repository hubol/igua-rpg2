import { Container } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { interpr, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Unit } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { DataPotion } from "../data/data-potion";
import { objAngelEyes } from "../objects/enemies/obj-angel-eyes";
import { objFigurePotion } from "../objects/figures/obj-figure-potion";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnDestroyOnStatusDeath } from "./mxn-destroy-on-status-death";
import { mxnPhysics } from "./mxn-physics";
import { MxnRpgStatus } from "./mxn-rpg-status";

interface MxnRpgStatusPotionsArgs {
    heldPotionIds: Array<DataPotion.Id>;
}

interface RpgStatusPotionsState {
    nextPoisonRecoveryRemainingHealthRatio: Unit;
}

function inferPotionToUse(
    status: RpgStatus.Model,
    potionIds: ReadonlyArray<DataPotion.Id>,
    state: RpgStatusPotionsState,
): DataPotion.Id | null {
    const remainingHealthRatio = status.health / status.healthMax;

    if (
        status.conditions.poison.level
        && remainingHealthRatio < state.nextPoisonRecoveryRemainingHealthRatio
        && potionIds.includes("PoisonRestore")
    ) {
        state.nextPoisonRecoveryRemainingHealthRatio = Math.max(0.1, remainingHealthRatio * 0.67);
        return "PoisonRestore";
    }

    if (remainingHealthRatio < 0.6 && potionIds.includes("RestoreHealth")) {
        return "RestoreHealth";
    }

    if (remainingHealthRatio < 0.6 && potionIds.includes("RestoreHealthRestaurantLevel1")) {
        return "RestoreHealthRestaurantLevel1";
    }

    if (remainingHealthRatio < 0.5 && potionIds.includes("RestoreHealthRestaurantLevel2")) {
        return "RestoreHealthRestaurantLevel2";
    }

    if (status.conditions.wetness.value <= 0 && Rng.float() < 0.3 && potionIds.includes("Wetness")) {
        return "Wetness";
    }

    return null;
}

function objUsedPotion(potionId: DataPotion.Id, statusObj: MxnRpgStatus & Container) {
    return objFigurePotion(potionId)
        .pivotedUnit(0.5, 0.5)
        .mixin(mxnDestroyOnStatusDeath, statusObj.status)
        .coro(function* (self) {
            const { height } = statusObj.getBounds();

            if (statusObj.is(mxnPhysics) && statusObj.isOnGround && statusObj.gravity > 0) {
                statusObj.speed.y = -2;
            }

            // TODO this should be less awkward, maybe each "pupil polar offset" should be weighted on the eyes...
            const pupilPolarOffset = vnew();
            const pupilPolarOffsetStart = vnew();

            const angelEyesObj = statusObj.findIs(objAngelEyes).last;
            if (angelEyesObj) {
                if (angelEyesObj.pupilPolarOffsets[0]) {
                    pupilPolarOffsetStart.at(angelEyesObj.pupilPolarOffsets[0]);
                    pupilPolarOffset.at(pupilPolarOffsetStart);
                }
                angelEyesObj.pupilPolarOffsets[2] = pupilPolarOffset;
            }

            yield* Coro.all([
                interpr(self, "angle").steps(4).to(360).over(400),
                interpvr(self).translate(0, -height).over(400),
                interpv(pupilPolarOffset).to(0, -1).over(400),
            ]);

            yield sleep(300);

            DataPotion.usePotion(potionId, statusObj);
            self.visible = false;

            yield interpv(pupilPolarOffset).to(pupilPolarOffsetStart).over(300);

            if (angelEyesObj) {
                delete angelEyesObj.pupilPolarOffsets[2];
            }

            self.destroy();
        })
        .at(statusObj)
        .add(0, statusObj.getBounds().height * -0.5)
        .vround();
}

export function mxnRpgStatusPotions(statusObj: MxnRpgStatus & Container, { heldPotionIds }: MxnRpgStatusPotionsArgs) {
    const state: RpgStatusPotionsState = {
        nextPoisonRecoveryRemainingHealthRatio: 0.8,
    };

    const dramaUseAppropriatePotion: () => Coro.Type<void> = function* () {
        if (heldPotionIds.length === 0) {
            return;
        }

        const potionId = inferPotionToUse(statusObj.status, heldPotionIds, state);
        if (!potionId) {
            return;
        }

        heldPotionIds.removeFirst(potionId);
        const potionObj = objUsedPotion(potionId, statusObj).show();
        yield () => potionObj.destroyed;
    };

    return statusObj
        .merge({
            mxnRpgStatusPotions: {
                dramaUseAppropriatePotion,
                heldPotionIds,
            },
        });
}
