import { IguanaLooks } from "../iguana/looks";

type Looks = IguanaLooks.Serializable;

export namespace IguaNet {
    export namespace Model {
        export interface Item {
            kind: "equipment" | "key_item" | "potion" | "pocket_item";
            id: string;
            level?: number;
        }
    }

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

            export interface GiftOffer {
                type: "gift_offer";
                item: Model.Item;
            }

            export interface GiftTake {
                type: "gift_take";
            }
        }

        export type FromClient = FromClient.Join | FromClient.Iguana | FromClient.GiftOffer | FromClient.GiftTake;

        export namespace FromServer {
            export interface RoomBroadcast {
                type: "room_broadcast";
                time: number;
                giftItem: Model.Item | null;
                iguanas: RoomBroadcast.Iguana[];
            }

            export interface RoomAccepted {
                type: "room_accepted";
                clientId: number;
                giftItem: Model.Item | null;
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
                    looks: Looks;
                }
            }

            export interface GiftOfferOutcome {
                type: "gift_offer_outcome";
                accepted: boolean;
            }

            export type GiftTakeOutcome =
                & { type: "gift_take_outcome" }
                & (GiftTakeOutcome.Success | GiftTakeOutcome.Failed);

            export namespace GiftTakeOutcome {
                export interface Success {
                    success: true;
                    item: Model.Item;
                }

                export interface Failed {
                    success: false;
                }
            }
        }

        export type FromServer =
            | FromServer.RoomBroadcast
            | FromServer.RoomAccepted
            | FromServer.GiftOfferOutcome
            | FromServer.GiftTakeOutcome;
    }
}
