import { z } from "zod";
import type { RegisterLoanInput } from "../../application/Loan/Usecase/RegisterLoanUsecase";
import type { LoanDTO } from "../../application/Loan/dtos/LoanDto";

const cpfPattern = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;

export const RegisterLoanSchema = z.object({
    BookId: z.string().min(1),
    Cpf: z.string().regex(cpfPattern),
}) satisfies z.ZodType<RegisterLoanInput>;

export const LoanDTOSchema: z.ZodType<LoanDTO> = RegisterLoanSchema.extend({
    Id: z.string().min(1),
    RegisteredAt: z.iso.datetime(),
    UpdatedAt: z.iso.datetime(),
    ReturnedAt: z.iso.datetime().optional(),
    DueDate: z.iso.datetime(),
});
