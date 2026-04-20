import { validate as isValidUUID } from 'uuid'; // npm i uuid @types/uuid

export class Id {
    private constructor(private readonly value: string) {
        if (!isValidUUID(value)) {
            throw new Error(`Invalid UUID: ${value}`);
        }
    }

    static generate(): Id {
        const uuid = crypto.randomUUID();
        return new Id(uuid);
    }

    static create(value: string): Id {
        return new Id(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Id): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}