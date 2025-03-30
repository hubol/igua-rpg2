const badgeThemes = {
    birth: "color: #000040; font-weight: bold; padding: 2px 4px; background-color: #f0f0ff; border-radius: 3px;",
    info: "color: #004000; font-weight: bold; padding: 2px 4px; background-color: #F0FFF0; border-radius: 3px;",
};

type BadgeTheme = keyof typeof badgeThemes;

export namespace Logging {
    export function badge(name: string, theme: BadgeTheme = "birth") {
        return [
            `%c${name}`,
            badgeThemes[theme],
        ];
    }

    export function componentArgs(name: string, impl: any);
    export function componentArgs(impl: any);
    export function componentArgs(name_impl: string | any, impl?: any) {
        const name = impl ? name_impl : name_impl.constructor.name;
        if (!impl) {
            impl = name_impl;
        }

        return [
            ...badge(name),
            impl,
        ];
    }
}
