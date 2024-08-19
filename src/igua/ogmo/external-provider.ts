import { SceneLibrary } from "../core/scene/scene-library";
import { NpcLooks } from "../iguana/npc-looks";

const enums: OgmoExternalProvider.Enum[] = [
    {
        name: 'Scene',
        values: SceneLibrary.getNames(),
    },
    {
        name: 'NpcLook',
        values: Object.keys(NpcLooks),
    }
];

const data: OgmoExternalProvider.Data = {
    enums,
}

namespace OgmoExternalProvider {
    export interface Enum {
        name: string;
        values: string[];    
    }

    export interface Data {
        enums: Enum[];
    }
}

export function provide() {
    window.parent.postMessage(data, '*');
    const preEl = document.createElement('pre');
    preEl.textContent = JSON.stringify(data, undefined, 2);
    document.body.prepend(preEl);
}