import { BLEND_MODES, Filter } from "pixi.js";
import { RgbInt } from "../../math/number-alias-types";
import { Force } from "../../types/force";
import { PixiFilterUtils } from "./pixi-filter-utils";

const fragment = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 tint;
uniform float factor;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    gl_FragColor.r = mix(c.r, tint.r, factor);
    gl_FragColor.g = mix(c.g, tint.g, factor);
    gl_FragColor.b = mix(c.b, tint.b, factor);
    gl_FragColor.a = c.a;
}
`;

export class ForceTintFilter extends Filter {
    private _tint = Force<RgbInt>();
    private _factor = Force<number>();

    constructor(tint = 0xffffff, factor = 1) {
        super(undefined, fragment);
        this.tint = tint;
        this.factor = factor;
        this.blendMode = BLEND_MODES.NORMAL_NPM;
    }

    get tint() {
        return this._tint;
    }

    get factor() {
        return this._factor;
    }

    set tint(value: RgbInt) {
        this._tint = value;
        this.uniforms.tint = PixiFilterUtils.getRgbIntAsGlslVec3(value);
    }

    set factor(value: number) {
        this._factor = value;
        this.uniforms.factor = value;
    }
}
