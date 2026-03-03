import { Logger } from "../../lib/game-engine/logger";
import { RethrownError } from "../../lib/rethrown-error";
import { IguanaLooks } from "../iguana/looks";
import { Rpg } from "../rpg/rpg";

const url = "https://avuncular-kimbra-disjointed.ngrok-free.dev";

export class IguaClient {
    constructor(
        private readonly _socket: WebSocket,
        private readonly _roomId: string,
    ) {
        this._socket.addEventListener("message", (event) => {
            let message: IguaClient.Message;

            try {
                message = IguaClient.parseMessage(event);
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

    private _send(message: IguaClient.Message) {
        this._socket.send(JSON.stringify(message));
    }

    private _room: IguaClient.Room = {
        iguanas: [],
    };

    get room() {
        return this._room;
    }

    private _receive(message: IguaClient.Message) {
        if (message.type === "room_broadcast") {
            this._room.iguanas.length = 0;
            this._room.iguanas.push(...message.iguanas as any);
        }
    }

    static create(args: IguaClient.CreateArgs) {
        const socket = new WebSocket(url);
        return new IguaClient(socket, args.roomId);
    }

    static parseMessage(event: MessageEvent): IguaClient.Message {
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

    export type Message = { type: string } & Record<string, unknown>;

    export namespace Room {
        export interface Iguana {
            id: number;
            x: number;
            y: number;
            duckUnit: number;
            speed: {
                x: number;
                y: number;
            };
            looks: IguanaLooks.Serializable;
        }
    }

    export interface Room {
        iguanas: Room.Iguana[];
    }
}
