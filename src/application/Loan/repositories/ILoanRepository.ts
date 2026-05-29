import type { LoanDTO } from "../dtos/LoanDto";

export interface ILoanRepository {
    save(loanDto: LoanDTO): Promise<void>;

    delete(id: string): Promise<void>;

    findByBookForCpf(bookId: string, cpf: string): Promise<LoanDTO | null>
}
