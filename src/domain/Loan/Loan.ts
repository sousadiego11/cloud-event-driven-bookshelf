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
    #returnedAt?: Date;
    #returned?: boolean;
    readonly #dueDate: Date;
    #updatedAt: Date;

    private constructor(
        id: LoanDomain.Id,
        bookId: LoanDomain.BookId,
        cpf: Cpf,
        registeredAt: Date,
        returnedAt: Date | undefined,
        returned: boolean,
        dueDate: Date,
        updatedAt: Date
    ) {
        this.#id = id;
        this.#bookId = bookId;
        this.#cpf = cpf;
        this.#registeredAt = registeredAt;
        this.#returnedAt = returnedAt;
        this.#dueDate = dueDate;
        this.#updatedAt = updatedAt;
    }

    static register(bookId: LoanDomain.BookId, cpf: LoanDomain.Cpf): Loan {
        const normalizedBookId = bookId.trim();
        const loanCpf = Cpf.create(cpf);
        const dueDate = DueDate.create(14);

        if (!normalizedBookId) {
            throw new DomainError("BookId cannot be empty");
        }

        const id = Id.generate();
        const registeredAt = new Date();

        return new Loan(id.getValue(), normalizedBookId, loanCpf, registeredAt, undefined, false, dueDate.value, registeredAt);
    }

    static fromDto(loanDto: LoanDTO): Loan {
        return new Loan(
            loanDto.Id,
            loanDto.BookId,
            Cpf.create(loanDto.Cpf),
            new Date(loanDto.RegisteredAt),
            loanDto.ReturnedAt ? new Date(loanDto.ReturnedAt) : undefined,
            loanDto.Returned,
            new Date(loanDto.DueDate),
            new Date(loanDto.UpdatedAt)
        );
    }

    returnNow(): void {
        if (this.#returnedAt) {
            throw new DomainError("Loan already returned");
        }

        this.#returnedAt = new Date();
        this.#updatedAt = new Date();
        this.#returned = true;
    }

    toDto(): LoanDTO {
        return {
            Id: this.#id,
            BookId: this.#bookId,
            Cpf: this.#cpf.value,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
            ReturnedAt: this.#returnedAt?.toISOString(),
            Returned: this.#returned ?? false,
            DueDate: this.#dueDate.toISOString()
        };
    }
}
