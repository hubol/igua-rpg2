import { spawn } from "child_process";

export class ProcessWithPipedOutput {
    private constructor() {
    }

    static run(...args: Parameters<typeof spawn>) {
        return new Promise<number | null>(resolve => {
            const child = spawn(...args);

            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);

            child.on("close", resolve);
        });
    }
}
