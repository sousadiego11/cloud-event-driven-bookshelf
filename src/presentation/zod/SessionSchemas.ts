import { z } from "zod";

export type SessionRequestContext = {
    connectionId: string;
};

export const SessionRequestContextSchema = z.object({
    connectionId: z.string().min(1),
}) satisfies z.ZodType<SessionRequestContext>;
