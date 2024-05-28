let hasGestured = false;

export const UserGesture = {
    get hasGestured() {
        return hasGestured;
    },

    receiveGestures(el: HTMLElement) {
        const onGesture = () => {
            hasGestured = true;
            for (const event of userGestureEvents)
                el.removeEventListener(event, onGesture);
        }

        for (const event of userGestureEvents)
            el.addEventListener(event, onGesture);
    }
}

// https://stackoverflow.com/a/56388462
const userGestureEvents = [
    'change',
    'click',
    'contextmenu',
    'dblclick',
    'mouseup',
    'pointerup',
    'reset',
    'submit',
    'touchend'
]