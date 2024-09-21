// How to rethrow an error: https://stackoverflow.com/a/42755876
export class RethrownError extends Error {
    public readonly originalError: unknown;
    public readonly stackBeforeRethrow?: string;

    constructor(message: string, error: unknown) {
        super(message);
        this.name = this.constructor.name;
        if (!error) {
            throw new Error("RethrownError requires a message and error");
        }

        this.originalError = error;
        this.stackBeforeRethrow = this.stack;
        const messageLines = (this.message.match(/\n/g) || []).length + 1;
        this.stack = (this.stack ?? "").split("\n").slice(0, messageLines + 1).join("\n") + "\n"
            + ((typeof error === "object" && "stack" in error) ? error.stack : "");
    }
}
