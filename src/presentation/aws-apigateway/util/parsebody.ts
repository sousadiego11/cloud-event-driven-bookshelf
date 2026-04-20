import type { ZodSchema } from "zod";

export function parseBody<T>(
    body: string | null,
    schema: ZodSchema<T>
): T {
    if (!body) {
        throw new Error("Request body is required");
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(body);
    } catch {
        throw new Error("Invalid JSON");
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
        throw new Error(
            `Validation error: ${JSON.stringify(result.error.format())}`
        );
    }

    return result.data;
}