interface DataKeyItem {
    name: string;
}

export const DataKeyItems = {
    UpgradedPickaxe: { name: "MyPicaxe Version 2.0" },
    SeedYellow: { name: "Seed (Yellow)" },
    SeedGreen: { name: "Seed (Green)" },
    SeedBlue: { name: "Seed (Blue)" },
    SeedPurple: { name: "Seed (Purple)" },
    __Unknown__: { name: "???" },
} satisfies Record<string, DataKeyItem>;

export type DataKeyItemInternalName = keyof typeof DataKeyItems;
