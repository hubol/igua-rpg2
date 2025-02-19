interface DataKeyItem {
    name: string;
}

export const DataKeyItems = {
    UpgradedPickaxe: { name: "MyPicaxe Version 2.0" },
} satisfies Record<string, DataKeyItem>;

export type DataKeyItemInternalName = keyof typeof DataKeyItems;
