import { DisplayObject } from "pixi.js";
import { DataNpcPersona } from "../data/data-npc-persona";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { Rpg } from "../rpg/rpg";
import { mxnSpeaker } from "./mxn-speaker";

export function mxnIguanaSpeaker(obj: DisplayObject, persona: DataNpcPersona.Type) {
    return obj
        .merge({
            mxnIguanaSpeaker: {
                rpgIguanaNpc: Rpg.iguanaNpc(persona.id),
            },
        })
        .mixin(mxnSpeaker, { name: persona.name, ...objIguanaNpc.getSpeakerColors(persona.looks) })
        .handles("mxnSpeaker.speakingStarted", (self) => {
            self.mxnIguanaSpeaker.rpgIguanaNpc.onSpeak();
        });
}
