import { ObjectLibrary } from "../core/object-library";
import { DevFsClient } from "./dev-fs-client";

const path = "raw/ogmo/igua-rpg2.ogmo";

export async function devUpdateOgmoProject() {
    const ogmoJson = await DevFsClient.readJson(path);

    const enumChoices: Record<string, ReadonlyArray<string>> = {
        objId: ObjectLibrary.getNames(),
    };

    for (const entity of ogmoJson.entities) {
        for (const value of entity.values) {
            if (value.definition !== "Enum" || !(value.name in enumChoices)) {
                continue;
            }

            value.choices = enumChoices[value.name];
        }
    }

    await DevFsClient.writeJson(path, ogmoJson);
}
