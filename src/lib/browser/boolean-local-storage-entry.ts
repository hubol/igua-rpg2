export class BooleanLocalStorageEntry {
    constructor(readonly key: string) {}

    get value() {
        return !!localStorage.getItem(this.key);
    }

    set value(value: boolean) {
        if (value) {
            localStorage.setItem(this.key, "true");
        }
        else {
            localStorage.removeItem(this.key);
        }
    }
}
