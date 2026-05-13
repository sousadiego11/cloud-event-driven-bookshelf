import { validate as isValidUUID } from 'uuid';
import hash from 'object-hash';

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

    static hash(obj: Record<string, any>): Id {
        const hashHex = hash.sha1(obj);
        return new Id(hashHex);
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