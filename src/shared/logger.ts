export class Logger {
    static log(message: string, meta?: unknown): void {
        console.log(`\n[LOG]: ${message}`);

        if (meta) {
            console.log("\n[META]:", JSON.stringify(meta, null, 2));
        }

        console.log("");
    }

    static error(message: string, error?: unknown): void {
        console.error(`\n[ERROR]: ${message}`);

        if (error instanceof Error) {
            console.error(`\n[MESSAGE]: ${error.message}`);
            console.error(`\n[STACK]: ${error.stack}`);
        } else if (error) {
            console.error(`\n[DETAILS]:`, JSON.stringify(error, null, 2));
        }

        console.error("");
    }
}