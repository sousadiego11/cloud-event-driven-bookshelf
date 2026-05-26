import { DomainError } from "../Error/errors";

export class Cpf {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    static create(value: string): Cpf {
        const normalizedValue = Cpf.normalize(value);

        if (!Cpf.isValid(normalizedValue)) {
            throw new DomainError("Cpf must be valid");
        }

        return new Cpf(normalizedValue);
    }

    get value(): string {
        return this.#value;
    }

    toString(): string {
        return this.#value;
    }

    private static normalize(value: string): string {
        return value.replace(/\D/g, "");
    }

    private static isValid(value: string): boolean {
        if (value.length !== 11 || /^(\d)\1{10}$/.test(value)) {
            return false;
        }

        const digits = value.split("").map(Number);
        const firstDigit = Cpf.calculateVerifierDigit(digits.slice(0, 9), 10);
        const secondDigit = Cpf.calculateVerifierDigit(digits.slice(0, 10), 11);

        return digits[9] === firstDigit && digits[10] === secondDigit;
    }

    private static calculateVerifierDigit(digits: number[], factor: number): number {
        const total = digits.reduce(
            (sum, digit, index) => sum + digit * (factor - index),
            0
        );
        const remainder = (total * 10) % 11;

        return remainder === 10 ? 0 : remainder;
    }
}
