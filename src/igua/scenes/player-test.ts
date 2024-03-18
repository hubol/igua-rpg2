import { container } from "../../lib/pixi/container";
import { objPlayer } from "../objects/obj-player";

export function PlayerTest() {
    const playerContainer = container().at(0, 128).show();
    objPlayer(playerLooksJson).show(playerContainer);
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