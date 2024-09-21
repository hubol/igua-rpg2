export const DeepAccess = {
    get<T extends Record<string, any>>(object: T, key: string): any {
        return key.split(".").reduce((memo, part) => memo[part], object);
    },
    set<T extends Record<string, any>>(object: T, key: string, value: any) {
        key.split(".").reduce((memo, part, index, array) => {
            if (index === array.length - 1) {
                (memo[part] as any) = value;
            }
            else {
                return memo[part];
            }
        }, object);
    },
};
