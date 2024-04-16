import { Graphics, Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { createPlayerObj } from "../objects/obj-player";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";

export function PlayerTest(looks = playerLooksJson) {
    const horizon = new Graphics().beginFill(0x813768).drawRect(0, 0, 256, 256).at(0, 128).show();
    const playerContainer = container().at(0, horizon.y + 2).show();
    createPlayerObj(looks).show(playerContainer);

    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, async () => {
        await show('Hello!');
    }).show()
}

const playerLooksJson = {
    "head": {
        "color": 10854782,
        "placement": {
            "x": 0,
            "y": -5
        },
        "crest": {
            "shape": 0,
            "color": 941101,
            "placement": {
                "x": 0,
                "y": 0
            },
            "flipV": false,
            "flipH": false
        },
        "eyes": {
            "placement": {
                "x": 0,
                "y": 0
            },
            "gap": 1,
            "tilt": 0,
            "pupils": {
                "mirrored": true,
                "placement": {
                    "x": -1,
                    "y": 1
                }
            },
            "left": {
                "sclera": {},
                "eyelid": {
                    "color": 10064727,
                    "placement": 2
                },
                "pupil": {
                    "shape": 7,
                    "color": 68111,
                    "placement": {
                        "x": 0,
                        "y": 0
                    },
                    "flipH": false
                }
            },
            "right": {
                "sclera": {},
                "eyelid": {
                    "color": 10064727,
                    "placement": 2
                },
                "pupil": {
                    "shape": 7,
                    "color": 68111,
                    "placement": {
                        "x": 0,
                        "y": 0
                    },
                    "flipH": false
                }
            }
        },
        "horn": {
            "shape": -1,
            "color": 941101,
            "placement": {
                "x": 0,
                "y": 0
            }
        },
        "mouth": {
            "shape": 0,
            "color": 68111,
            "placement": {
                "x": 0,
                "y": 0
            },
            "flipV": false
        }
    },
    "body": {
        "color": 2380974,
        "placement": {
            "x": 0,
            "y": 0
        },
        "tail": {
            "shape": 1,
            "color": 941101,
            "placement": {
                "x": -7,
                "y": 0
            },
            "club": {
                "shape": 2,
                "color": 2380974,
                "placement": {
                    "x": 0,
                    "y": -3
                }
            }
        }
    },
    "feet": {
        "fore": {
            "left": {
                "shape": 5,
                "color": 10064727,
                "claws": {
                    "color": 14868415,
                    "shape": 0,
                    "placement": 2
                }
            },
            "right": {
                "shape": 5,
                "color": 10064727,
                "claws": {
                    "color": 14868415,
                    "shape": 0,
                    "placement": 2
                }
            }
        },
        "hind": {
            "left": {
                "shape": 0,
                "color": 10064727,
                "claws": {
                    "color": 14868415,
                    "shape": 0,
                    "placement": 2
                }
            },
            "right": {
                "shape": 0,
                "color": 10064727,
                "claws": {
                    "color": 14868415,
                    "shape": 0,
                    "placement": 2
                }
            }
        },
        "gap": 2,
        "backOffset": 3
    }
};