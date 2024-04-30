import { Sprite } from "pixi.js";
import { createPlayerObj } from "../objects/obj-player";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { objSolidBlock, objSolidRamp } from "../objects/obj-terrain";
import { Input } from "../globals";
import { Rng } from "../../lib/math/rng";

export function PlayerTest(looks = playerLooksJson) {
    const b = objSolidBlock().at(96, 160).show();
    b.width = 96;
    b.height = 32;

    const b2 = objSolidBlock().at(56, 256 - 32).show();
    b2.width = 200;
    b2.height = 16;

    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, async () => {
        await show('Hello!');
    }).show()

    objSolidBlock().at(128, 100).step(block => {
        if (Input.isDown('SelectUp'))
            block.y -= 1;

        if (Input.justWentDown('CastSpell')) {
            block.x = Rng.int(32, 200);
            block.y = Rng.int(32, 200);
            block.width = Rng.int(8, 64);
            block.height = Rng.int(8, 64);
        }
    }).show();

    const ramp = objSolidRamp().at(64 + 128, 100).show();
    ramp.width = 120;
    ramp.height = 60;

    const ramp2 = objSolidRamp().at(56, 160).show();
    ramp2.width = 40;
    ramp2.height = 40;

    const ramp3 = objSolidRamp().at(140, 60).show();
    ramp3.width = -80;
    ramp3.height = 40;

    for (let i = 0; i < 1; i++)
        createPlayerObj(looks).at((256 / 20) * i, 40).step(player => {
            if (player.y > 256 + player.height)
                player.y = 0;
            if (player.x > 256 + player.width)
                player.x = -player.width;
            else if (player.x < -player.width)
                player.x = 256 + player.width;
        }).show();
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