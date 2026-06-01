import type { InventoryDTO } from "../../application/Inventory/dtos/InventoryDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

export namespace InventoryDomain {
    export type Id = string;
    export type BookId = string;
    export type Copies = number;
    export type Available = number;
}

export class Inventory {
    readonly #id: InventoryDomain.Id;
    readonly #bookId: InventoryDomain.BookId;
    readonly #copies: InventoryDomain.Copies;
    #available: InventoryDomain.Available;
    readonly #registeredAt: Date;
    #updatedAt: Date;

    private constructor(
        id: InventoryDomain.Id,
        bookId: InventoryDomain.BookId,
        copies: InventoryDomain.Copies,
        available: InventoryDomain.Available,
        registeredAt: Date,
        updatedAt: Date
    ) {
        this.#id = id;
        this.#bookId = bookId;
        this.#copies = copies;
        this.#available = available;
        this.#registeredAt = registeredAt;
        this.#updatedAt = updatedAt;
    }

    static register(bookId: InventoryDomain.BookId, copies: InventoryDomain.Copies): Inventory {
        const normalizedBookId = bookId.trim();

        if (!normalizedBookId) {
            throw new DomainError("BookId cannot be empty");
        }

        if (!Number.isInteger(copies)) {
            throw new DomainError("Copies must be an integer");
        }

        if (copies < 0) {
            throw new DomainError("Copies cannot be negative");
        }

        const id = Id.generate();
        const registeredAt = new Date();
        return new Inventory(id.getValue(), normalizedBookId, copies, copies, registeredAt, registeredAt);
    }

    static fromDto(inventoryDto: InventoryDTO): Inventory {
        return new Inventory(
            inventoryDto.Id,
            inventoryDto.BookId,
            inventoryDto.Copies,
            inventoryDto.Available,
            new Date(inventoryDto.RegisteredAt),
            new Date(inventoryDto.UpdatedAt)
        );
    }

    lendOne(): void {
        if (this.#available <= 0) {
            throw new DomainError("Book is out of stock");
        }

        this.#available -= 1;
        this.#updatedAt = new Date();
    }

    returnOne(): void {
        if (this.#available >= this.#copies) {
            throw new DomainError("Book inventory is already full");
        }

        this.#available += 1;
        this.#updatedAt = new Date();
    }

    getCopies(): InventoryDomain.Copies {
        return this.#copies;
    }

    getAvailable(): InventoryDomain.Available {
        return this.#available;
    }

    toDto(): InventoryDTO {
        return {
            Id: this.#id,
            BookId: this.#bookId,
            Copies: this.#copies,
            Available: this.#available,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }
}
