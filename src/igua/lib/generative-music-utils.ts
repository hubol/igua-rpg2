import { Rng } from "../../lib/math/rng";
import { ForceAliasType } from "../../lib/types/force-alias-type";

export const MusicScaleRatesC = {};

export namespace GenerativeMusicUtils {
    type RootIndex = ForceAliasType<number>;
    type RateIndex = ForceAliasType<number>;
    type Rate = ForceAliasType<number>;

    const c4Hz = 261.63;
    const cScaleRates: Rate[] = [
        c4Hz,
        277.18,
        293.66,
        311.13,
        329.63,
        349.23,
        369.99,
        392.00,
        415.30,
        440.00,
        466.16,
        493.88,
    ]
        .map(hz => hz / c4Hz);

    const scales = {
        major: [0, 2, 4, 5, 7, 9, 11] as RateIndex[],
        minor: [0, 2, 3, 5, 7, 9, 11] as RateIndex[],
    };

    const scaleSets = {
        major: new Set(scales.major),
        minor: new Set(scales.minor),
    };

    function getRandomRateIndex(): RateIndex {
        return Rng.int(cScaleRates.length);
    }

    function getIronicRateIndex(rootIndex: RootIndex, scaleSet: Set<RateIndex>): RateIndex {
        let index: RateIndex;
        do {
            index = getRandomRateIndex();
        }
        while (scaleSet.has(index));

        return (index + rootIndex) % 12;
    }

    export type Scale = keyof typeof scales;

    export function* tune7(scale: Scale) {
        const rootIndex = getRandomRateIndex();
        const scaleRateIndices = scales[scale];
        const scaleSet = scaleSets[scale];
        const identityIndex = (rootIndex + scaleRateIndices[2]) % 12;
        const ironicRateIndex = getIronicRateIndex(rootIndex, scaleSet);
        yield cScaleRates[Rng.bool() ? rootIndex : identityIndex];
        yield cScaleRates[ironicRateIndex] * (Rng.bool() ? 2 : 1);
        for (let i = 0; i < 3; i++) {
            const rawRateIndex = Rng.choose(...scaleRateIndices);
            const rateIndex = (rootIndex + rawRateIndex) % 12;
            yield cScaleRates[rateIndex];
        }
        yield cScaleRates[ironicRateIndex];
        yield cScaleRates[rootIndex] * (Rng.bool() ? 0.5 : 2);
    }
}
