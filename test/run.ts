import * as fs from "fs";
import * as path from "path";
import { doGlobalSetup } from "./global-setup";
import { ErrorPrinter } from "./lib/error-printer";
import { paint } from "./lib/paint";
import { TestPromise } from "./lib/test-promise";

function findTestFiles() {
    const directory = path.resolve(__dirname, "tests/");
    console.log(directory);
    return fs.readdirSync(directory)
        .map(file => path.resolve(directory, file));
}

const failedTestNames: string[] = [];

export async function runTests() {
    doGlobalSetup();
    const filterTestNameFn = getFilterTestNameFn();

    const files = findTestFiles();

    for (const file of files) {
        await runTestsInFile(file, filterTestNameFn);
    }

    logFailedTests();

    process.exit(failedTestNames.length ? 1 : 0);
}

function logFailedTests() {
    if (!failedTestNames.length) {
        return;
    }

    console.log(`
${paint.red(`${failedTestNames.length} test(s) failed:`)}
${failedTestNames.map(name => `- ${name}`).join("\n")}`);
}

// Seems buggy due to Dexie... investigate
// async function runWithTimeout(fn: Function, timeoutMs: number) {
//     let timedOut = false;
//     const timeout = TestPromise.sleep(timeoutMs)
//         .then(() => timedOut = true);
//     await Promise.race([
//         fn(),
//         timeout,
//     ]);
//     if (timedOut)
//         throw new Error(`Timed out after ${timeoutMs}ms`);
// }

type FilterTestNameFn = (name: string) => true;

function getFilterTestNameFn(): FilterTestNameFn {
    try {
        const module = require("./filter-test-name");
        const fn = Object.values(module).filter(x => typeof x === "function")[0] as Function;
        if (fn) {
            console.log(`Got filterTestName ${fn}`);
            return fn as any;
        }
    }
    catch (e) {}

    return () => true;
}

async function runTestsInFile(file: string, filterTestName: FilterTestNameFn) {
    const fileName = path.parse(file).base;

    const module = require(file);
    for (const fn of Object.values(module)) {
        if (typeof fn !== "function") {
            continue;
        }

        if (!filterTestName(fn.name)) {
            continue;
        }

        const testName = `${fileName} > ${fn.name}`;

        try {
            await fn();
            console.log(paint.bgGreen`PASS` + " " + testName);
        }
        catch (e) {
            failedTestNames.push(testName);
            console.log();
            console.log(paint.red`------------`);
            console.log(paint.bgRed`FAIL` + " " + testName);
            console.log(ErrorPrinter.toPrintable(e));
            console.log(paint.red`------------`);
            console.log();
        }
    }
}

// @ts-ignore
if (require.main === module) {
    runTests();
}
