import { Logger } from "../../lib/game-engine/logger";
import { Integer, Unit } from "../../lib/math/number-alias-types";
import { VectorSimple } from "../../lib/math/vector-type";
import { RethrownError } from "../../lib/rethrown-error";
import { Null } from "../../lib/types/null";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { IguaNet } from "./igua-net";

const url = "https://avuncular-kimbra-disjointed.ngrok-free.dev";

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

    get isOpen() {
        return this._socket.readyState === WebSocket.OPEN;
    }

    update(x: number, y: number, ducking: Unit, speed: VectorSimple) {
        this._send({ type: "iguana", x: Math.round(x), y: Math.round(y), ducking, speed: { x: speed.x, y: speed.y } });
    }

    private readonly _offerTransactions = new TransactionList<IguaNet.Message.FromServer.GiftOfferOutcome>();

    offer(item: RpgInventory.Item) {
        const transaction = this._offerTransactions.add();
        this._send({ type: "gift_offer", item });
        return transaction;
    }

    private readonly _takeTransactions = new TransactionList<IguaNet.Message.FromServer.GiftTakeOutcome>();

    take() {
        const transaction = this._takeTransactions.add();
        this._send({ type: "gift_take" });
        return transaction;
    }

    private _send(message: IguaNet.Message.FromClient) {
        if (this.isOpen) {
            this._socket.send(JSON.stringify(message));
        }
    }

    private _isAcceptedToRoom = false;
    private _clientId = Null<number>();

    private _room: IguaClient.Room = {
        time: -1,
        iguanas: [],
        giftItem: null,
    };

    get room() {
        return this._isAcceptedToRoom ? this._room : null;
    }

    private _receive(message: IguaNet.Message.FromServer) {
        if (message.type === "room_accepted") {
            this._clientId = message.clientId;
            this._isAcceptedToRoom = true;
        }

        if (!this._isAcceptedToRoom) {
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
            // @ts-expect-error Eh...
            this._room.giftItem = message.giftItem;

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

namespace IguaClient {
    export interface CreateArgs {
        roomId: string;
    }

    export interface Room {
        time: Integer;
        iguanas: IguaNet.Message.FromServer.RoomBroadcast.Iguana[];
        giftItem: RpgInventory.Item | null;
    }
}

interface Transaction<T> {
    outcome: T | null;
}

class TransactionList<TOutcome> {
    private readonly _impl = new Array<Transaction<TOutcome>>();

    add() {
        const transaction: Transaction<TOutcome> = { outcome: null };
        this._impl.push(transaction);
        return transaction;
    }

    complete(outcome: TOutcome) {
        this._impl.last.outcome = outcome;
    }
}
