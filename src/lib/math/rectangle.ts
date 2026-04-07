export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function areRectanglesOverlapping(a: IRectangle, b: IRectangle) {
    return a.x + a.width > b.x
        && a.x < b.x + b.width
        && a.y + a.height > b.y
        && a.y < b.y + b.height;
}

export function areRectanglesNotOverlapping(a: IRectangle, b: IRectangle) {
    return a.x + a.width < b.x
        || a.x > b.x + b.width
        || a.y + a.height < b.y
        || a.y > b.y + b.height;
}

export namespace IRectangle {
    export function isEnveloped(parent: IRectangle, child: IRectangle) {
        return parent.x <= child.x
            && (parent.x + parent.width) >= (child.x + child.width)
            && parent.y <= child.y
            && (parent.y + parent.height) >= (child.y + child.height);
    }
}
