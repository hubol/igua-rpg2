export namespace Logging {
    export function componentArgs(name: string, impl: any);
    export function componentArgs(impl: any);
    export function componentArgs(name_impl: string | any, impl?: any) {
        const name = impl ? name_impl : name_impl.constructor.name;
        if (!impl) {
            impl = name_impl;
        }

        return [
            `%c${name}`,
            "color: #000040; font-weight: bold; padding: 2px 4px; background-color: #f0f0ff; border-radius: 3px;",
            impl,
        ];
    }
}
