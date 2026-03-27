import { ForceAliasType } from "../types/force-alias-type";

type CamelCase = ForceAliasType<string>;

function toEnglish(camel: CamelCase) {
    return toEnglishWords(camel).join(" ");
}

function toEnglishWords(camel: CamelCase) {
    if (!camel) {
        return [camel];
    }

    const result = [camel[0].toUpperCase()];

    for (let i = 1; i < camel.length; i++) {
        const code = camel.charCodeAt(i);
        if (code >= 65 && code <= 90 && result.last) {
            result.push("");
        }
        result.last += camel[i];
    }

    return result;
}

export const StringTransform = {
    toEnglish,
    toEnglishWords,
};
