import type { OrderDTO, OrderItemDTO } from "../../application/Order/dtos/OrderDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

export namespace OrderDomain {
    export type Id = string;
    export type UserId = string;
    export type ProductId = string;
    export type Items = Array<{ productId: ProductId; quantity: number }>;
    export type Status = "created" | "paid" | "canceled" | "shipped";
}

export class Order {
    readonly #id: OrderDomain.Id;
    readonly #userId: OrderDomain.UserId;
    readonly #items: OrderDomain.Items;
    #status: OrderDomain.Status;
    readonly #createdAt: Date;
    #updatedAt: Date;

    private constructor(id: OrderDomain.Id, userId: OrderDomain.UserId, items: OrderDomain.Items) {
        this.#id = id;
        this.#userId = userId;
        this.#items = items;
        this.#status = "created";
        this.#createdAt = new Date();
        this.#updatedAt = this.#createdAt;
    }

    static createFromDto(userId: OrderDomain.UserId, items: OrderItemDTO[]): Order {
        if (!userId || userId.trim().length === 0) {
            throw new DomainError("UserId cannot be empty");
        }

        if (!items || items.length === 0) {
            throw new DomainError("Order must have at least one item");
        }

        for (const item of items) {
            if (!item.ProductId || item.ProductId.trim().length === 0) {
                throw new DomainError("ProductId cannot be empty");
            }
            if (!Number.isInteger(item.Quantity) || item.Quantity <= 0) {
                throw new DomainError("Quantity must be positive integer");
            }
        }

        const id = Id.generate();
        return new Order(id.getValue(), userId, items.map((item) => ({ productId: item.ProductId, quantity: item.Quantity })));
    }

    pay(): void {
        if (this.#status !== "created") {
            throw new DomainError(`Cannot pay order in status: ${this.#status}`);
        }
        this.#status = "paid";
        this.#updatedAt = new Date();
    }

    cancel(): void {
        if (this.#status === "paid") {
            throw new DomainError("Cannot cancel paid order");
        }
        this.#status = "canceled";
        this.#updatedAt = new Date();
    }

    ship(): void {
        if (this.#status !== "paid") {
            throw new DomainError(`Cannot ship order in status: ${this.#status}`);
        }
        this.#status = "shipped";
        this.#updatedAt = new Date();
    }

    toDto(): OrderDTO {
        return {
            Id: this.#id,
            UserId: this.#userId,
            Items: this.#items.map((item) => ({ ProductId: item.productId, Quantity: item.quantity })),
            Status: this.#status,
            CreatedAt: this.#createdAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }
}
