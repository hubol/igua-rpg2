import { intervalWait } from "../lib/interval-wait";
import { NpmExecutable } from "../lib/npm-executable";
import { ProcessWithPipedOutput } from "../lib/process-with-piped-output";
import { startParcelWatcher } from "../lib/start-parcel-watcher.mjs";

export default async function () {
    let events = 1;
    await startParcelWatcher("./", () => events++, "public/");
    while (true) {
        await intervalWait(() => events > 0);
        await ProcessWithPipedOutput.run(NpmExecutable.npm, ["run", "test"], {});
        events = 0;
    }
}
