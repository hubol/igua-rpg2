type ForceAliasName<T> = T & { readonly __t?: unique symbol };

type CamelCase = ForceAliasName<string>;

function toEnglish(camel: CamelCase) {
    if (!camel) {
        return camel;
    }

    let result = camel[0].toUpperCase();

    for (let i = 1; i < camel.length; i++) {
        const code = camel.charCodeAt(i);
        if (code >= 65 && code <= 90) {
            result += " ";
        }
        result += camel[i];
    }

    return result;
}

export const StringCase = {
    toEnglish,
};
