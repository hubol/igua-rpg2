export namespace RpgEconomy {
    export namespace Currency {
        export type Type = 'green' | 'orange' | 'blue';

        export const Values: Record<Type, number> = {
            green: 1,
            orange: 5,
            blue: 15,
        }

        export const DescendingTypes: Type[] = [ 'blue', 'orange', 'green' ];
    }
}