import z, { ZodError } from "zod";
import { DomainError } from "../../domain/Error/errors";

export class ApiResponse {
    private static readonly headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Content-Type": "application/json",
    };

    static ok(data: unknown) {
        return {
            statusCode: 200,
            headers: this.headers,
            body: JSON.stringify(data),
        };
    }

    static created(data?: unknown) {
        return {
            statusCode: 201,
            headers: this.headers,
            body: JSON.stringify(data ?? {}),
        };
    }

    static error(error: unknown) {
        // ZOD VALIDATION
        if (error instanceof ZodError) {
            return {
                statusCode: 400,
                headers: this.headers,
                body: JSON.stringify({
                    error: "Validation error",
                    details: z.treeifyError(error),
                }),
            };
        }

        // DOMAIN ERROR
        if (error instanceof DomainError) {
            return {
                statusCode: 400,
                headers: this.headers,
                body: JSON.stringify({
                    error: error.message,
                    type: error.name,
                }),
            };
        }

        // GENERIC ERROR
        if (error instanceof Error) {
            return {
                statusCode: 500,
                headers: this.headers,
                body: JSON.stringify({
                    error: error.message,
                }),
            };
        }

        // UNKNOWN
        return {
            statusCode: 500,
            headers: this.headers,
            body: JSON.stringify({
                error: "Unknown error",
            }),
        };
    }
}