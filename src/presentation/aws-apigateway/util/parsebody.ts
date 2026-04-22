import type { ZodType } from "zod";

export function parseBody<T>(
    body: string | null,
    schema: ZodType<T>
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
        throw result.error;
    }

    return result.data;
}