import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataLib } from "./data-lib";

export namespace DataTemporaryEffect {
    export interface Model {
        hudText: string;
        buffs: RpgPlayerBuffs.MutatorFn;
    }

    export const { getById, manifest } = DataLib.create(
        "DataTemporaryEffect",
        {
            IntelligenceFromLibraryBook: {
                hudText: "Library book makes you feel smarter",
                buffs: (model) => {
                    model.attributes.intelligence += 1;
                },
            },
            LightFromWizardStatue: {
                hudText: "Wizard's likeness improves vision in dark",
                buffs: (model) => {
                    model.esoteric.nightVisionLevel += 1;
                },
            },
            MidairJumpFromHelium: {
                hudText: "Unusual helium enables midair jump",
                buffs: (model) => {
                    model.motion.jump.midairCount += 1;
                },
            },
            MeleePoisonValueFromHall: {
                hudText: "Magic room increases poison build up",
                buffs: (model) => {
                    model.combat.melee.conditions.poison.value += 9966;
                },
            },
            HomunculusFlame: {
                hudText: "Homunculus of Flame makes melee attacks fiery",
                buffs: (model) => {
                    model.combat.melee.conditions.overheat.damage += 10;
                    model.combat.melee.conditions.overheat.value += 80;
                },
            },
            HomunculusEarth: {
                hudText: "Homunculus of Earth makes you feel sturdy",
                buffs: (model) => {
                    model.motion.walk.topSpeedIncreaseFactor -= 20;
                    model.combat.defense.physical += 80;
                },
            },
            HomunculusForest: {
                hudText: "Homunculus of the Forest brings you in touch with nature",
                buffs: (model) => {
                    model.loot.tiers.nothingRerollCount += 2;
                    model.loot.specialEvents.replaceItemsWithForestSpritChance += 10;
                },
            },
            HomunculusLight: {
                hudText: "Homunculus of Light enables vision in the dark",
                buffs: (model) => {
                    model.esoteric.nightVisionLevel += 2;
                },
            },
            HomunculusWater: {
                hudText: "Homunculus of Water allows you to take on more fluid",
                buffs: (model) => {
                    model.conditions.wetnessMaxIncreaseFactor += 400;
                },
            },
            HomunculusSkies: {
                hudText: "Homunculus of the Skies allows you to jump in midair",
                buffs: (model) => {
                    model.motion.jump.midairCount += 1;
                },
            },
            __Fallback__: {
                hudText: "This is a bug",
                buffs: () => {},
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
