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
    // const b = objSolidBlock().at(96, 160).show();
    // b.width = 96;
    // b.height = 32;

    // const b7 = objSolidBlock().at(96, 160 - 80).show();
    // b7.width = 96;
    // b7.height = 32;

    // for (let i = 0; i < 8; i++) {
    //     const b2 = objSolidBlock().at(160, 160 - i * 12).show();
    //     b2.width = 32;
    //     b2.height = 12;
    // }

    // const b2 = objSolidBlock().at(56, 256 - 32).show();
    // b2.width = 200;
    // b2.height = 16;

    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, async () => {
        await show('Hello!');
    }).show()

    let value = 128;

    const bar = objStatusBar({
        width: 100,
        height: 8,
        maxValue: value,
        tintBack: 0xff0000,
        tintFront: 0x0000ff,
        value,
        decreases: [
            { tintBar: 0x800000, },
            { tintBar: 0x008000, },
        ],
        increases: [
            { tintBar: 0x00ff00, },
            { tintBar: 0xffff00, },
        ]
    })
    .step(() => {
        if (Input.justWentDown('CastSpell')) {
            value = Math.max(0, value + 20);
            bar.increase(value, 20, 0);
        }
        if (playerObj.collides(LockedDoor)) {
            value = Math.max(0, value - 1);
            bar.decrease(value, 1, 1);
        }

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
    .at(2, 2)
    .show(layers.hud);

    // objSolidBlock().at(128, 100).step(block => {
    //     if (Input.isDown('SelectUp'))
    //         block.y -= 1;

    //     if (Input.justWentDown('CastSpell')) {
    //         block.x = Rng.int(32, 200);
    //         block.y = Rng.int(32, 200);
    //         block.width = Rng.int(8, 64);
    //         block.height = Rng.int(8, 64);
    //     }
    // }).show();

    // const ramp = objSolidRamp().at(64 + 128, 100).show();
    // ramp.width = 120;
    // ramp.height = 60;

    // const ramp2 = objSolidRamp().at(56, 160 + 40).show();
    // ramp2.width = -40;
    // ramp2.height = -40;

    // const ramp4 = objSolidRamp().at(56 - 40, 160 - 40).show();
    // ramp4.width = 40;
    // ramp4.height = -40;

    // const ramp5 = objSolidRamp().at(56 + 40, 160 - 120).show();
    // ramp5.width = -40;
    // ramp5.height = 40;

    // const ramp3 = objSolidRamp().at(56 + 40, 160 - 40).show();
    // ramp3.width = 40;
    // ramp3.height = 40;

    // const ramp6 = objSolidRamp().at(56 + 40 - 40, 160 - 40 + 40).show();
    // ramp6.width = 40;
    // ramp6.height = 40;

    // const ramp3 = objSolidRamp().at(140, 60).show();
    // ramp3.width = -80;
    // ramp3.height = 40;

    const { LockedDoor } = Lvl.Test();
    LockedDoor.async(async () => {
        while (true) {
            LockedDoor.add(Rng.vunit().scale(4));
            await sleep(60);
        }
    })

    // level();

    // for (let i = 0; i < 1; i++)
    //     createPlayerObj(looks).at((256 / 20) * i, 40).step(player => {
    //         if (player.y > 256 + player.height)
    //             player.y = 0;
    //         if (player.x > 256 + player.width)
    //             player.x = -player.width;
    //         else if (player.x < -player.width)
    //             player.x = 256 + player.width;
    //     }).show();
}

function level() {
    const b = container();
    objSolidBlock().at(32, 0).scaled(-128, 32).show(b);
    objSolidSlope().at(32, 32).scaled(-64, -32).show(b);
    objSolidSlope().at(128, 32).scaled(32, -32).show(b);
    objSolidBlock().at(32, 96).scaled(128, 32).show(b);
    objSolidBlock().at(160, 0).scaled(32, 128).show(b);

    objPipe().at(192, 112).scaled(48, 48).show(b);
    objPipeSlope().at(192, -16).scaled(48, 48).show(b);
    // objPipeSlope().at(192, 16).scaled(80, 80).show(b).texture = NoAtlasTx.Placeholder;

    // objPipeSlope().at(0, 64).scaled(80, 80).show(b);
    // objPipe().at(80, 64).scaled(48, 48).show(b);
    // objPipeSlope().at(128, 64).scaled(-80, 80).show(b);
    // objPipe().at(208, 144).scaled(48, 48).show(b);

    // objPipe().at(200, 96).scaled(96, 48).show(b);
    // objPipeSlope().at(200, 32).scaled(-80, 80).show(b);

    for (const child of b.children) {
        child.x -= 32;
        child.y += 64;
    }

    b.show();
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