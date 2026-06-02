import type { ZodType } from "zod";

export function parseContext<T>(
    context: unknown,
    schema: ZodType<T>
): T {
    const result = schema.safeParse(context);

    if (!result.success) {
        throw result.error;
    }

    return result.data;
}
