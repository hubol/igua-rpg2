import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmTemplate extends RpgMicrocosm<MicrocosmTemplate.State> {
    constructor(private readonly _config: MicrocosmTemplate.Config) {
        super();
    }

    protected createState(): MicrocosmTemplate.State {
        throw new Error("Method not implemented.");
    }
}

namespace MicrocosmTemplate {
    export interface State {
    }

    export interface Config {
    }
}
