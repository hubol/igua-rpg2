import { Environment } from "../environment";
import { Null } from "../types/null";
import { onViewportResize } from "./on-viewport-resize";
import { Viewport } from "./viewport";

export function integralUpscaleCanvas(canvasElement: HTMLCanvasElement) {
    const doUpscale = createDoUpscale(canvasElement);
    doUpscale();
    onViewportResize(doUpscale);
}

function createDoUpscale(canvas: HTMLCanvasElement) {
    let appliedWidth = Null<number>();
    let appliedHeight = Null<number>();

    return function () {
        const padding = 20;

        const container = Environment.isDev ? canvas.parentElement!.getBoundingClientRect() : Viewport;

        const availableWidth = container.width - padding;
        const availableHeight = container.height - padding;

        const availableAspectRatio = availableWidth / availableHeight;
        const naturalAspectRatio = canvas.width / canvas.height;

        const linearScale = availableAspectRatio < naturalAspectRatio
            ? (availableWidth / canvas.width)
            : (availableHeight / canvas.height);

        const scale = getIntegralScale(linearScale);

        const width = scale * canvas.width;
        const height = scale * canvas.height;

        if (appliedWidth === width && appliedHeight === height) {
            return;
        }

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        appliedWidth = width;
        appliedHeight = height;
    };
}

function getIntegralScale(linearScale: number) {
    if (window.devicePixelRatio > 0) {
        return Math.max(1, Math.floor(linearScale * window.devicePixelRatio)) / window.devicePixelRatio;
    }
    return Math.max(1, Math.floor(linearScale));
}
