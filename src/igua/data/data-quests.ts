import { RpgQuests } from "../rpg/rpg-quests";

export const DataQuests = {
    NewBalltownArmorerReceivesFish: { complexity: "normal", rewards: { valuables: 160 } },
    NewBalltownFanaticDelivery: { complexity: "easy", rewards: { valuables: 50 } },
    NewBalltownUnderneathHomeownerEnemyPresenceCleared: { complexity: "easy", rewards: { valuables: 100 } },
    NewBalltownUnderneathMagicRisingFace: { complexity: "normal", rewards: { valuables: 100 } },
} satisfies Record<string, RpgQuests.DataModel>;

export type DataQuestInternalName = keyof typeof DataQuests;
