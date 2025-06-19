import { Pojo } from "../../types/pojo";

type Mutable = Pojo | Array<unknown>;

export function onMutate<TMutable extends Mutable>(mutable: TMutable) {
    const json = JSON.stringify(mutable);
    return () => JSON.stringify(mutable) !== json;
}
