import { ZodError } from "zod";
import { DomainError } from "../../domain/Error/errors";

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

    static error(error: unknown) {
        // ZOD VALIDATION
        if (error instanceof ZodError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Validation error",
                    details: error.format(),
                }),
            };
        }

        // DOMAIN ERROR
        if (error instanceof DomainError) {
            return {
                statusCode: 400,
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
                body: JSON.stringify({
                    error: error.message,
                }),
            };
        }

        // UNKNOWN
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Unknown error",
            }),
        };
    }
}