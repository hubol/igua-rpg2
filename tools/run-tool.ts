function getToolFn(name: string) {
    try {
        const module = require(`./${name}`);
        if (!module.default) {
            throw new Error(`Module ${name} does not have a default export!`);
        }
        if (!module.default || typeof module.default !== "function") {
            throw new Error(`Module ${name} has a default export that is not a function!`);
        }
        return module.default;
    }
    catch (e) {
        console.error(`Failed to start tool "${name}"`);
        console.error(e);
    }
}

getToolFn(process.argv[2])?.(...process.argv.slice(3));
