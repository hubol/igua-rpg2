import { elHubol } from "./lib/el-hubol";
import html from "./el-toast.html";

export function elToast(title: string, description: string, type: "warn" | "info", durationMs: number) {
    const context = {
        title,
        description,
        type,
        svg: type === "warn" ? warningSvg : infoSvg,
    };

    const el = elHubol(html, context);

    setTimeout(() => {
        el.classList.add("out");
        setTimeout(() => {
            el.remove();
        }, 2000);
    }, durationMs);

    return el;
}

const warningSvg =
    `<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 44 35.6">
  <defs>
    <style>
      .cls-2 {
        stroke: #000000;
      }

      .cls-2, .cls-3 {
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .cls-3 {
        fill: #E04020;
        stroke: #E04020;
        stroke-width: 2px;
      }

      .cls-4 {
        filter: url(#luminosity-noclip);
      }

      .cls-5 {
        mask: url(#mask);
      }
    </style>
    <filter id="luminosity-noclip" x="0" y="0" width="44" height="35.6" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg"/>
      <feBlend in="SourceGraphic" in2="bg"/>
    </filter>
    <mask id="mask" x="0" y="0" width="44" height="35.6" maskUnits="userSpaceOnUse">
      <g class="cls-4">
        <g>
          <polygon class="cls-2" points="23.9 24.07 20.1 24.07 19.62 9.24 24.38 9.24 23.9 24.07"/>
          <circle class="cls-1" cx="22" cy="29.5" r="3.32"/>
        </g>
      </g>
    </mask>
  </defs>
  <g class="cls-5">
    <polygon class="cls-3" points="1 34.6 22 1 43 34.6 1 34.6"/>
  </g>
</svg>`;

const infoSvg =
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 44 39.63">
  <defs>
    <style>
      .cls-1 {
        stroke: #000000;
      }

      .cls-1, .cls-2 {
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .cls-1, .cls-3 {
        fill: #000000;
      }

      .cls-2 {
        fill: #3870A8;
        stroke: #3870A8;
        stroke-width: 2px;
      }

      .cls-4 {
        filter: url(#luminosity-noclip);
      }

      .cls-5 {
        mask: url(#mask);
      }
    </style>
    <filter id="luminosity-noclip" x="2.18" y="0" width="39.63" height="39.63" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg"/>
      <feBlend in="SourceGraphic" in2="bg"/>
    </filter>
    <mask id="mask" x="2.18" y="0" width="39.63" height="39.63" maskUnits="userSpaceOnUse">
      <g class="cls-4">
        <g>
          <circle class="cls-3" cx="22" cy="10.47" r="4.37"/>
          <rect class="cls-1" x="19.15" y="18.29" width="5.71" height="13.7"/>
        </g>
      </g>
    </mask>
  </defs>
  <g class="cls-5">
    <circle class="cls-2" cx="22" cy="19.82" r="18.82"/>
  </g>
</svg>`;
