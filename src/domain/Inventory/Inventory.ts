import type { InventoryDTO } from "../../application/Inventory/repositories/IInventoryRepository";
import { DomainError } from "../Error/errors";

export namespace InventoryDomain {
    export type Id = string;
    export type ProductId = string;
}

export class Inventory {
    id: InventoryDomain.Id;
    productId: InventoryDomain.ProductId;
    total: number;
    reserved: number;

    private constructor(id: InventoryDomain.Id, productId: InventoryDomain.ProductId, total: number, reserved = 0) {
        this.id = id;
        this.productId = productId;
        this.total = total;
        this.reserved = reserved;
    }

    static create(id: InventoryDomain.Id, productId: InventoryDomain.ProductId, total: number): Inventory {
        return new Inventory(id, productId, total, 0);
    }

    static restore(id: InventoryDomain.Id, productId: InventoryDomain.ProductId, total: number, reserved: number): Inventory {
        return new Inventory(id, productId, total, reserved);
    }

    reserve(quantity: number): void {
        if (quantity <= 0) {
            throw new DomainError("Quantity must be greater than zero");
        }

        if (this.available() < quantity) {
            throw new DomainError("Not enough stock");
        }

        this.reserved += quantity;
    }

    release(quantity: number): void {
        if (quantity <= 0) return;

        this.reserved -= quantity;

        if (this.reserved < 0) {
            this.reserved = 0;
        }
    }

    confirm(quantity: number): void {
        if (quantity <= 0) {
            throw new DomainError("Quantity must be greater than zero");
        }

        if (this.reserved < quantity) {
            throw new DomainError("Not enough reserved stock to confirm");
        }

        this.reserved -= quantity;
        this.total -= quantity;
    }

    available(): number {
        return this.total - this.reserved;
    }

    toDto(): InventoryDTO {
        return {
            Id: this.id,
            ProductId: this.productId,
            Total: this.total,
            Reserved: this.reserved,
            Available: this.available(),
        };
    }
}
