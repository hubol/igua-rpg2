const { serialize, literal } = require("./serialize-utils");

// Generate a TypeScript source file from an ogmo project file
// This would be less necessary if [this](https://github.com/microsoft/TypeScript/issues/32063)
// were implemented. But here we are.

/**
@param {import("@hubol/smooch/template-api").TemplateContext.JsonAggregate} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { format }) {
    if (files.length < 1) {
        console.log("Got <1 files. What is going on?!");
        return "";
    }

    if (files.length > 1) {
        console.log("Got >1 files: ", files.join(", "));
    }

    const file = files[0];

    const entities = file.json.entities.reduce((obj, entity) => {
        obj[entity.name] = literal(`null as unknown as ${serialize(Object.assign({}, ...entity.values.map(convertOgmoEntityValueToPartialTypeScriptInterface)), 0)}`);
        return obj;
    }, {});

    const source = `// This file is generated.

const entityValues = ${serialize(entities)};

export namespace OgmoProject {
    export namespace Entities {
        export type Values = typeof entityValues;
        export type Names = keyof Values;
    }
}`;

    return format(source, { parser: 'typescript', printWidth: 500 });
}

const ogmoEntityDefinitionToLiterals = {
    "Boolean": literal("boolean"),
    "Integer": literal("number"),
    "RGB": literal("string"),
    "String": literal("string"),
}

const unknownLiteral = literal("unknown");

function convertOgmoEntityValueToTypeScriptType(value) {
    if (value.definition in ogmoEntityDefinitionToLiterals) {
        return ogmoEntityDefinitionToLiterals[value.definition];
    }

    if (value.definition === 'Enum') {
        return literal(value.choices.map(choice => `"${choice}"`).join(" | "));
    }

    return unknownLiteral;
}

function convertOgmoEntityValueToPartialTypeScriptInterface(value) {
    return { [value.name]: convertOgmoEntityValueToTypeScriptType(value) };
}