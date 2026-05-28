import type { InventoryDTO } from "../../application/Inventory/dtos/InventoryDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

export namespace InventoryDomain {
    export type Id = string;
    export type BookId = string;
    export type Quantity = number;
}

export class Inventory {
    readonly #id: InventoryDomain.Id;
    readonly #bookId: InventoryDomain.BookId;
    #quantity: InventoryDomain.Quantity;
    readonly #registeredAt: Date;
    #updatedAt: Date;

    private constructor(
        id: InventoryDomain.Id,
        bookId: InventoryDomain.BookId,
        quantity: InventoryDomain.Quantity,
        registeredAt: Date,
        updatedAt: Date
    ) {
        this.#id = id;
        this.#bookId = bookId;
        this.#quantity = quantity;
        this.#registeredAt = registeredAt;
        this.#updatedAt = updatedAt;
    }

    static register(bookId: InventoryDomain.BookId, quantity: InventoryDomain.Quantity): Inventory {
        const normalizedBookId = bookId.trim();

        if (!normalizedBookId) {
            throw new DomainError("BookId cannot be empty");
        }

        if (!Number.isInteger(quantity)) {
            throw new DomainError("Quantity must be an integer");
        }

        if (quantity < 0) {
            throw new DomainError("Quantity cannot be negative");
        }

        const id = Id.generate();
        const registeredAt = new Date();
        return new Inventory(id.getValue(), normalizedBookId, quantity, registeredAt, registeredAt);
    }

    static fromDto(inventoryDto: InventoryDTO): Inventory {
        return new Inventory(
            inventoryDto.Id,
            inventoryDto.BookId,
            inventoryDto.Quantity,
            new Date(inventoryDto.RegisteredAt),
            new Date(inventoryDto.UpdatedAt)
        );
    }

    lendOne(): void {
        if (this.#quantity <= 0) {
            throw new DomainError("Book is out of stock");
        }

        this.#quantity -= 1;
        this.#updatedAt = new Date();
    }

    toDto(): InventoryDTO {
        return {
            Id: this.#id,
            BookId: this.#bookId,
            Quantity: this.#quantity,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }
}
