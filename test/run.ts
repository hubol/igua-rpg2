import * as fs from "fs";
import * as path from "path";
import { paint } from "./lib/paint";
import { ErrorPrinter } from "./lib/error-printer";

function findTestFiles() {
    const directory = path.resolve(__dirname, 'tests/');
    console.log(directory);
    return fs.readdirSync(directory)
        .map(file => path.resolve(directory, file));
}

const failedTestNames: string[] = [];

export async function runTests() {
    const files = findTestFiles();

    for (const file of files) {
        await runTestsInFile(file);
    }

    logFailedTests();

    process.exit(failedTestNames.length ? 1 : 0);
}

function logFailedTests() {
    if (!failedTestNames.length)
        return;

    console.log(`
${paint.red(`${failedTestNames.length} test(s) failed:`)}
${failedTestNames.map(name => `- ${name}`).join('\n')}`);
}

async function runTestsInFile(file: string) {
    const fileName = path.parse(file).base;

    const module = require(file);
    for (const fn of Object.values(module)) {
        if (typeof fn !== 'function')
            continue;

        const testName = `${fileName} > ${fn.name}`;

        try {
            await fn();
            console.log(paint.bgGreen`PASS` + ' ' + testName);
        }
        catch (e) {
            failedTestNames.push(testName);
            console.log();
            console.log(paint.red`------------`);
            console.log(paint.bgRed`FAIL` + ' ' + testName);
            console.log(ErrorPrinter.toPrintable(e));
            console.log(paint.red`------------`);
            console.log();
        }
    }
}

runTests();