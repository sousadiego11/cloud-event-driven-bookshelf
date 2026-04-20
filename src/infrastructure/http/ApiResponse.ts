export class ApiResponse {
    static ok(data: unknown) {
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    }

    static created(data?: unknown) {
        return {
            statusCode: 201,
            body: JSON.stringify(data ?? {}),
        };
    }

    static error(message: string, statusCode = 500) {
        return {
            statusCode,
            body: JSON.stringify({ error: message }),
        };
    }
}