export class Logger {
    static log(message: string, meta?: unknown): void {
        console.log(`\n[LOG]: ${message}`);

        if (meta) {
            console.log("[META]:", JSON.stringify(meta, null, 2));
        }

        console.log("");
    }

    static error(message: string, error?: unknown): void {
        console.error(`\n[ERROR]: ${message}`);

        if (error instanceof Error) {
            console.error(`[MESSAGE]: ${error.message}`);
            console.error(`[STACK]: ${error.stack}`);
        } else if (error) {
            console.error(`[DETAILS]:`, JSON.stringify(error, null, 2));
        }

        console.error("");
    }
}