import { Pojo } from "../../lib/types/pojo";

export namespace DevFsClient {
    export async function readText(path: string): Promise<string> {
        return await (await fetch(`/fs/${path}`)).text();
    }

    export async function readJson<T = any>(path: string): Promise<T> {
        return await (await fetch(`/fs/${path}`)).json();
    }

    export async function writeText(path: string, text: string) {
        await fetch(`/fs/${path}`, {
            method: "POST",
            body: text,
        });
    }

    export async function writeJson(path: string, pojo: Pojo) {
        await fetch(`/fs/${path}`, {
            method: "POST",
            body: JSON.stringify(pojo, undefined, 2),
        });
    }
}
