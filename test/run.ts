export async function runTests() {
    const files = [
        "pixi-ticker-integration",
    ];

    for (const file of files) {
        console.log(file);

        const module = require(`./${file}`);
        for (const fn of Object.values(module)) {
            if (typeof fn !== 'function')
                continue;

            console.log(fn.name);
            await fn();
        }
    }
}

runTests();