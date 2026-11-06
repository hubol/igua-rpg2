// TODO is miner really a faction?? lol
export type RpgFaction = "player" | "enemy" | "miner";
export namespace RpgFaction {
    export function getOpposingFaction(faction: RpgFaction): RpgFaction | null {
        if (faction === "player") {
            return "enemy";
        }
        if (faction === "enemy") {
            return "player";
        }
        return null;
    }
}
