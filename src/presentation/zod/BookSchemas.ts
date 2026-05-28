import { z } from "zod";
import type { RegisterBookInput } from "../../application/Book/Usecase/RegisterBookUsecase";
import type { BookDTO } from "../../application/Book/dtos/BookDto";

export const RegisterBookSchema = z.object({
    Title: z.string().min(1),
    Author: z.string().min(1),
    Isbn: z.string().min(1)
}) satisfies z.ZodType<RegisterBookInput>;

export const BookDTOSchema: z.ZodType<BookDTO> = z.object({
    Title: z.string().min(1),
    Author: z.string().min(1),
    Isbn: z.string().min(1),
    Id: z.string().min(1),
    RegisteredAt: z.iso.datetime(),
    UpdatedAt: z.iso.datetime(),
});
