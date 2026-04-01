import { Environment } from "../../lib/environment";
import { Logger } from "../../lib/game-engine/logger";
import { Integer, Unit } from "../../lib/math/number-alias-types";
import { VectorSimple } from "../../lib/math/vector-type";
import { RethrownError } from "../../lib/rethrown-error";
import { Null } from "../../lib/types/null";
import { DataItem } from "../data/data-item";
import { IguanaLooks } from "../iguana/looks";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { IguaNet } from "./igua-net";

const url = (function (devServiceEnvironment: "dev" | "prod" = "dev") {
    const IguaNetServiceEnvironment = {
        dev: {
            url: "http://localhost:9999",
        },
        prod: {
            url: "wss://igua-net-f2fb9b46b4a2.herokuapp.com",
        },
    };

    return IguaNetServiceEnvironment[Environment.isProduction ? "prod" : devServiceEnvironment].url;
})();

export class IguaClient {
    constructor(
        private readonly _socket: WebSocket,
        private readonly _roomId: string,
    ) {
        this._socket.addEventListener("message", (event) => {
            let message: IguaNet.Message.FromServer;

            try {
                message = IguaClient.parseServerMessage(event);
            }
            catch (e) {
                Logger.logContractViolationError("IguaClient", new RethrownError("Server sent invalid message", e), {
                    event,
                });
                this._socket.close();
                return;
            }

            this._receive(message);
        });

        this._socket.addEventListener("open", () => {
            this._send({ type: "join", roomId: this._roomId, iguanaLooks: Rpg.character.looks });
        });
    }

    private get _isSocketOpen() {
        return this._socket.readyState === WebSocket.OPEN;
    }

    private _previousUpdateJson = "";

    close() {
        this._socket.close();
    }

    private _skippedUpdatesCount = 0;

    update(
        x: number,
        y: number,
        ducking: Unit,
        facing: Unit,
        speed: VectorSimple,
        isSmoking: boolean,
        isSparkling: boolean,
    ) {
        if (!this._isSocketOpen) {
            return;
        }

        const update = {
            type: "iguana" as const,
            x: Math.round(x),
            y: Math.round(y),
            ducking,
            facing: Math.sign(facing) || 1,
            speed: { x: speed.x, y: speed.y },
            flags: 0 | (Number(isSmoking) << 0) | (Number(isSparkling) << 1),
        };

        const updateJson = JSON.stringify(update);
        if (this._skippedUpdatesCount < 150 && updateJson === this._previousUpdateJson) {
            this._skippedUpdatesCount++;
            return;
        }
        this._skippedUpdatesCount = 0;
        this._send(update);
        this._previousUpdateJson = updateJson;
    }

    private readonly _offerTransactions = new TransactionList<IguaNet.Message.FromServer.GiftOfferOutcome>();

    offer(item: RpgInventory.Item) {
        const transaction = this._offerTransactions.add();
        const serverItem: IguaNet.Model.Item = { ...item, level: "level" in item ? item.level : 1 };
        this._send({ type: "gift_offer", item: serverItem });
        return transaction;
    }

    private readonly _takeTransactions = new TransactionList<IguaNet.Message.FromServer.GiftTakeOutcome>();

    take() {
        const transaction = this._takeTransactions.add();
        this._send({ type: "gift_take" });
        return transaction;
    }

    private _send(message: IguaNet.Message.FromClient) {
        if (this._isSocketOpen) {
            this._socket.send(JSON.stringify(message));
        }
    }

    private _joinRoomAccepted = false;
    private _clientId = Null<number>();

    private _room: IguaClient.Room.Private = {
        time: -1,
        iguanas: [],
        iguanaLooks: {},
        giftItem: null,
    };

    private static readonly _offlineRoom: IguaClient.Room.Public = Object.seal({
        time: Number.MIN_SAFE_INTEGER,
        iguanas: [],
        giftItem: null,
    });

    static sanitizeItem(item: IguaNet.Model.Item | null): RpgInventory.Item | null {
        if (!item) {
            return null;
        }

        const clientItem = item as RpgInventory.Item;

        if (DataItem.isValid(clientItem)) {
            return clientItem;
        }

        return { kind: "equipment", id: "HackerRemnant", level: 1 };
    }

    get isOnline() {
        return this._joinRoomAccepted && this._isSocketOpen;
    }

    get room(): IguaClient.Room.Public {
        if (!this.isOnline) {
            return IguaClient._offlineRoom;
        }

        return {
            time: this._room.time,
            giftItem: this._room.giftItem,
            iguanas: this._room.iguanas
                .filter((iguana) => iguana.id in this._room.iguanaLooks)
                .map((iguana) => ({ ...iguana, looks: this._room.iguanaLooks[iguana.id] })),
        };
    }

    private _receive(message: IguaNet.Message.FromServer) {
        if (message.type === "room_accepted") {
            this._clientId = message.clientId;
            this._joinRoomAccepted = true;
            this._room.giftItem = IguaClient.sanitizeItem(message.giftItem);
            this._room.iguanas = message.iguanas;
            this._room.iguanaLooks = message.iguanaLooks;
        }

        if (message.type === "iguana_identify") {
            this._room.iguanaLooks[message.id] = message.looks;
        }

        if (message.type === "iguana_destroy") {
            delete this._room.iguanaLooks[message.id];
        }

        if (!this._joinRoomAccepted) {
            return;
        }

        if (message.type === "room_broadcast") {
            this._room.time = message.time;
            this._room.iguanas.length = 0;
            for (let i = 0; i < message.iguanas.length; i++) {
                const iguana = message.iguanas[i];
                if (iguana.id !== this._clientId) {
                    this._room.iguanas.push(iguana);
                }
            }

            this._room.giftItem = IguaClient.sanitizeItem(message.giftItem);

            return;
        }

        if (message.type === "gift_offer_outcome") {
            this._offerTransactions.complete(message);
            return;
        }

        if (message.type === "gift_take_outcome") {
            this._takeTransactions.complete(message);
            return;
        }
    }

    static create(args: IguaClient.CreateArgs) {
        const socket = new WebSocket(url);
        return new IguaClient(socket, args.roomId);
    }

    static parseServerMessage(event: MessageEvent): IguaNet.Message.FromServer {
        if (typeof event.data !== "string") {
            throw new Error("event.data is not string: " + typeof event.data);
        }

        const message = JSON.parse(event.data);

        if (typeof message !== "object") {
            throw new Error("event.data is not an object");
        }

        if (typeof message.type !== "string") {
            throw new Error("event.data.type is not a string");
        }

        return message;
    }
}

export namespace IguaClient {
    export interface CreateArgs {
        roomId: string;
    }

    export namespace Room {
        interface Common {
            time: Integer;
            giftItem: RpgInventory.Item | null;
        }

        export interface Public extends Common {
            iguanas: (IguaNet.Message.FromServer.RoomBroadcast.Iguana & { looks: IguanaLooks.Serializable })[];
        }

        export interface Private extends Common {
            iguanas: IguaNet.Message.FromServer.RoomBroadcast.Iguana[];
            iguanaLooks: Record<Integer, IguanaLooks.Serializable>;
        }
    }

    export interface Room {
        time: Integer;
        iguanas: (IguaNet.Message.FromServer.RoomBroadcast.Iguana & { looks: IguanaLooks.Serializable })[];
        giftItem: RpgInventory.Item | null;
    }

    export interface Transaction<T> {
        outcome: T | null;
    }
}

class TransactionList<TOutcome> {
    private readonly _impl = new Array<IguaClient.Transaction<TOutcome>>();

    add() {
        const transaction: IguaClient.Transaction<TOutcome> = { outcome: null };
        this._impl.push(transaction);
        return transaction;
    }

    complete(outcome: TOutcome) {
        this._impl.last.outcome = outcome;
    }
}
