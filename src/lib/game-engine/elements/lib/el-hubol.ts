const appliedStyles = new Set<string>();

export function elHubol(html: string, context?: Record<string, any>) {
    const el = document.createElement("div");

    for (const key in context) {
        html = html.replaceAll("${" + key + "}", context[key]);
    }
    el.innerHTML = html;

    const styleEl = el.querySelector("style");
    if (styleEl) {
        if (!appliedStyles.has(styleEl.innerText)) {
            styleEl.id = "elHubol_appliedStyle_" + appliedStyles.size;
            document.head.appendChild(styleEl);
            appliedStyles.add(styleEl.innerText);
        }
    }

    return el.querySelector(":not(style)")!;
}
