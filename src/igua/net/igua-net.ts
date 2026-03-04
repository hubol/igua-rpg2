import { IguanaLooks } from "../iguana/looks";

type Looks = IguanaLooks.Serializable;

export namespace IguaNet {
    export namespace Message {
        export namespace FromClient {
            export interface Join {
                type: "join";
                roomId: string;
                iguanaLooks: Looks;
            }

            export interface Iguana {
                type: "iguana";
                x: number;
                y: number;
                ducking: number;
                speed: {
                    x: number;
                    y: number;
                };
            }
        }

        export type FromClient = FromClient.Join | FromClient.Iguana;

        export namespace FromServer {
            export interface RoomBroadcast {
                type: "room_broadcast";
                time: number;
                iguanas: RoomBroadcast.Iguana[];
            }

            export interface RoomAccepted {
                type: "room_accepted";
                clientId: number;
            }

            export namespace RoomBroadcast {
                export interface Iguana {
                    id: number;
                    x: number;
                    y: number;
                    ducking: number;
                    speed: {
                        x: number;
                        y: number;
                    };
                    looks: Looks;
                }
            }
        }

        export type FromServer = FromServer.RoomBroadcast | FromServer.RoomAccepted;
    }
}
