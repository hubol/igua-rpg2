import { Sprite } from "pixi.js";
import { createPlayerObj, playerObj } from "../objects/obj-player";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";
import { Input, layers, scene } from "../globals";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { objStatusBar } from "../objects/obj-status-bar";

export function PlayerTest(looks = playerLooksJson) {
    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, async () => {
        await show('Hello!');
    }).show()

    let emoValue = 20;

    const emoBar = objStatusBar({
        width: emoValue,
        height: 7,
        maxValue: emoValue,
        tintBack: 0x000000,
        tintFront: 0x008000,
        value: emoValue,
        decreases: [
            { tintBar: 0x80b000, },
        ],
        increases: [
            { tintBar: 0x00ff00, },
        ]
    })
    .step(() => {
        if (Input.justWentDown('CastSpell')) {
            emoValue = Math.max(0, emoValue - 10);
            emoBar.decrease(emoValue, 10, 0);
        }
        // if (playerObj.collides(LockedDoor)) {
        //     value = Math.max(0, value - 1);
        //     bar.decrease(value, 1, 1);
        // }

        // if (Input.justWentDown('Jump')) {
        //     value = Math.max(0, value - 5);
        //     bar.decrease(value, 5, 1);
        // }
        // if (Input.justWentDown('InventoryMenuToggle')) {
        //     value = Math.min(bar.maxValue, value + 20);
        //     bar.increase(value, 20, 0);
        // }
        // if (Input.justWentDown('MoveLeft')) {
        //     value = Math.min(bar.maxValue, value + 10);
        //     bar.increase(value, 10, 1);
        // }
    }, 3)
    .at(3, 13)
    .show(layers.hud);

    const { LockedDoor } = Lvl.Test();
    LockedDoor.async(async () => {
        while (true) {
            LockedDoor.add(Rng.vunit().scale(4));
            await sleep(60);
        }
    });

    playerObj.step(() => {
        if (Input.justWentDown('CastSpell')) {
            playerObj.heal(20);
        }
        if (playerObj.collides(LockedDoor)) {
            playerObj.poison(1);
        }
        if (Input.justWentDown('InventoryMenuToggle')) {
            playerObj.damage(20);
        }
    })
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