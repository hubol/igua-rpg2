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
                iguanas: RoomBroadcast.Iguana[];
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
                    looks: object;
                }
            }
        }

        export type FromServer = FromServer.RoomBroadcast;
    }
}
