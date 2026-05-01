import { Integer } from "../../../lib/math/number-alias-types";
import { RpgStatus } from "../../rpg/rpg-status";
import { objStatusBar } from "./obj-status-bar";

const DamageIndex: Record<RpgStatus.DamageKind, Integer> = {
    // TODO should non-status damage types show their own damage chunks? digits?
    [RpgStatus.DamageKind.Emotional]: 1,
    [RpgStatus.DamageKind.Physical]: 1,
    [RpgStatus.DamageKind.Poison]: 0,
    [RpgStatus.DamageKind.Overheat]: 2,
};

export function objHealthBar(width: number, height: number, value: number, maxValue: number) {
    const bar = objStatusBar({
        width,
        height,
        maxValue,
        tintBack: 0xff0000,
        tintFront: 0x0000ff,
        value,
        decreases: [
            {
                tintBar: 0x008000,
                digit: {
                    signed: false,
                    size: "medium",
                    tint: 0x004000,
                    align: "right",
                },
            },
            {
                tintBar: 0x800000,
                digit: {
                    signed: false,
                    size: "medium",
                    tint: 0xffffff,
                    align: "right",
                },
            },
            {
                tintBar: 0xb43900,
                digit: {
                    signed: false,
                    size: "medium",
                    tint: 0xffe600,
                    align: "right",
                },
            },
        ],
        increases: [
            {
                tintBar: 0x00ff00,
                digit: {
                    signed: true,
                    size: "medium",
                    tint: 0xffffff,
                    align: "left",
                },
            },
        ],
    })
        .merge({
            effects: {
                healed(value, delta) {
                    bar.increase(value, delta, 0);
                },
                tookDamage(
                    remainingHealth,
                    physicalDamage,
                    emotionalDamage,
                    poisonDamage,
                    overheatDamage,
                ) {
                    const damage = physicalDamage + emotionalDamage + poisonDamage + overheatDamage;
                    if (damage === 0) {
                        bar.decrease(remainingHealth, 0, DamageIndex[RpgStatus.DamageKind.Physical]);
                        return;
                    }
                    let virtualHealth = remainingHealth + damage;
                    // TODO this looks like shit
                    if (physicalDamage > 0) {
                        virtualHealth -= physicalDamage;
                        bar.decrease(virtualHealth, physicalDamage, DamageIndex[RpgStatus.DamageKind.Physical]);
                    }
                    if (emotionalDamage > 0) {
                        virtualHealth -= emotionalDamage;
                        bar.decrease(virtualHealth, emotionalDamage, DamageIndex[RpgStatus.DamageKind.Emotional]);
                    }
                    if (poisonDamage > 0) {
                        virtualHealth -= poisonDamage;
                        bar.decrease(virtualHealth, poisonDamage, DamageIndex[RpgStatus.DamageKind.Poison]);
                    }
                    if (overheatDamage > 0) {
                        virtualHealth -= overheatDamage;
                        bar.decrease(virtualHealth, overheatDamage, DamageIndex[RpgStatus.DamageKind.Overheat]);
                    }
                },
            } satisfies Pick<RpgStatus.Effects, "healed" | "tookDamage">,
        });

    return bar;
}
