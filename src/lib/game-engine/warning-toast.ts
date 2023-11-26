const rootEl = document.createElement('div');
rootEl.id = 'toast';
document.body.appendChild(rootEl);

function show(title: string, description: string, durationMs = 5000) {
    const divEl = document.createElement('div');
    divEl.className = "warning_toast";
    divEl.innerHTML = `${warningSvg}
<div class="message">
    <p class="title">${title}</p>
    <p class="description">${description}</p>
</div>`;
    rootEl.appendChild(divEl);
    setTimeout(() => {
      divEl.classList.add('out');
      setTimeout(() => {
        divEl.remove();
      }, 2000);
    }, durationMs);
}

export const WarningToast = {
    show,
};

const warningSvg = `<svg class="warning" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 44 35.6">
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