import { RpgStatus } from "../../rpg/rpg-status";
import { objStatusBar } from "./obj-status-bar";

const DamageIndex = {
    // TODO should non-status damage types show their own damage chunks? digits?
    [RpgStatus.DamageKind.Emotional]: 1,
    [RpgStatus.DamageKind.Physical]: 1,
    [RpgStatus.DamageKind.Poison]: 0,
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
                tookDamage(value, delta, kind) {
                    bar.decrease(value, Math.abs(delta), DamageIndex[kind]);
                },
            } satisfies Pick<RpgStatus.Effects, "healed" | "tookDamage">,
        });

    return bar;
}
