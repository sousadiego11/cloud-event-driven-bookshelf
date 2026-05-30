import type { LoanDTO } from "../../application/Loan/dtos/LoanDto";
import { Id } from "../../application/Shared/Id";
import { Cpf } from "./Cpf";
import { DomainError } from "../Error/errors";
import { DueDate } from "./DueDate";

export namespace LoanDomain {
    export type Id = string;
    export type BookId = string;
    export type Cpf = string;
}

export class Loan {
    readonly #id: LoanDomain.Id;
    readonly #bookId: LoanDomain.BookId;
    readonly #cpf: Cpf;
    readonly #registeredAt: Date;
    readonly #returnedAt?: Date;
    readonly #dueDate: Date;
    readonly #updatedAt: Date;

    private constructor(
        id: LoanDomain.Id,
        bookId: LoanDomain.BookId,
        cpf: Cpf,
        registeredAt: Date,
        returnedAt: Date | undefined,
        dueDate: Date
    ) {
        this.#id = id;
        this.#bookId = bookId;
        this.#cpf = cpf;
        this.#registeredAt = registeredAt;
        this.#returnedAt = returnedAt;
        this.#dueDate = dueDate;
        this.#updatedAt = registeredAt;
    }

    static register(bookId: LoanDomain.BookId, cpf: LoanDomain.Cpf): Loan {
        const normalizedBookId = bookId.trim();
        const loanCpf = Cpf.create(cpf);
        const dueDate = DueDate.create(14);

        if (!normalizedBookId) {
            throw new DomainError("BookId cannot be empty");
        }

        const id = Id.generate();
        return new Loan(id.getValue(), normalizedBookId, loanCpf, new Date(), undefined, dueDate.value);
    }

    toDto(): LoanDTO {
        return {
            Id: this.#id,
            BookId: this.#bookId,
            Cpf: this.#cpf.value,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
            ReturnedAt: this.#returnedAt?.toISOString(),
            DueDate: this.#dueDate.toISOString()
        };
    }
}
