import { Coro } from "../../lib/game-engine/routines/coro";
import { Unit } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { DataPotion } from "../data/data-potion";
import { RpgStatus } from "../rpg/rpg-status";
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

export function mxnRpgStatusPotions(statusObj: MxnRpgStatus, { heldPotionIds }: MxnRpgStatusPotionsArgs) {
    const state: RpgStatusPotionsState = {
        nextPoisonRecoveryRemainingHealthRatio: 0.8,
    };

    const dramaUseAppropriatePotion: () => Coro.Type<void> = function* () {
        if (heldPotionIds.length === 0) {
            return;
        }

        const { status } = statusObj;

        const potionId = inferPotionToUse(status, heldPotionIds, state);
        if (!potionId) {
            return;
        }

        DataPotion.usePotion(potionId, statusObj);
    };

    return statusObj
        .merge({
            mxnRpgStatusPotions: {
                dramaUseAppropriatePotion,
                heldPotionIds,
            },
        });
}
