import { Filter } from "pixi.js";
import { AdjustColor } from "../adjust-color";

const fragment = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 red;
uniform vec3 green;
uniform vec3 blue;
uniform vec3 white;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    float whiteFactor = c.r * c.g * c.b * c.r * c.g * c.b;

    gl_FragColor.r = mix(red.r * c.r + green.r * c.g + blue.r * c.b, white.r, whiteFactor);
    gl_FragColor.g = mix(red.g * c.r + green.g * c.g + blue.g * c.b, white.g, whiteFactor);
    gl_FragColor.b = mix(red.b * c.r + green.b * c.g + blue.b * c.b, white.b, whiteFactor);
    gl_FragColor.a = c.a;
}
`;

export class MapRgbFilter extends Filter {
    constructor(red = 0, green = 0, blue = 0, white = 0xffffff) {
        const uniforms = {
            red: getPixiColorAsGlslVec3(red),
            green: getPixiColorAsGlslVec3(green),
            blue: getPixiColorAsGlslVec3(blue),
            white: getPixiColorAsGlslVec3(white),
        };
        super(undefined, fragment, uniforms);
    }
}

function getPixiColorAsGlslVec3(color: number) {
    const { r, g, b } = AdjustColor.pixi(color).toRgb();
    return [r / 255, g / 255, b / 255];
}
