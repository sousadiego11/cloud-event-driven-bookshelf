import { DomainError } from "../Error/errors";

export class DueDate {
    readonly #value: Date;

    private constructor(value: Date) {
        this.#value = value;
    }

    static create(days: number): DueDate {
        if (!Number.isInteger(days)) {
            throw new DomainError("Days must be an integer");
        }

        if (days <= 0) {
            throw new DomainError("Days must be greater than zero");
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        return new DueDate(dueDate);
    }

    get value(): Date {
        return new Date(this.#value);
    }

    toISOString(): string {
        return this.#value.toISOString();
    }

    isOverdue(referenceDate: Date = new Date()): boolean {
        return referenceDate > this.#value;
    }
}