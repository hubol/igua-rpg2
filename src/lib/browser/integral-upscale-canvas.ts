import { onViewportResize } from "./on-viewport-resize";
import { Viewport } from "./viewport";

export function integralUpscaleCanvas(canvasElement: HTMLCanvasElement) {
    const doUpscale = createDoUpscale(canvasElement);
    doUpscale();
    onViewportResize(doUpscale);
}

function createDoUpscale(canvas: HTMLCanvasElement) {
    let lastSeenViewportMin = -1;

    return function () {
        if (Viewport.min === lastSeenViewportMin) {
            return;
        }

        const padding = 20;
        const availableWidth = Viewport.width - padding;
        const availableHeight = Viewport.height - padding;

        const availableAspectRatio = availableWidth / availableHeight;
        const naturalAspectRatio = canvas.width / canvas.height;

        const linearScale = availableAspectRatio < naturalAspectRatio
            ? (availableWidth / canvas.width)
            : (availableHeight / canvas.height);

        const scale = getIntegralScale(linearScale);

        const width = scale * canvas.width;
        const height = scale * canvas.height;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        lastSeenViewportMin = Viewport.min;
    };
}

function getIntegralScale(linearScale: number) {
    if (window.devicePixelRatio > 0) {
        return Math.max(1, Math.floor(linearScale * window.devicePixelRatio)) / window.devicePixelRatio;
    }
    return Math.max(1, Math.floor(linearScale));
}
