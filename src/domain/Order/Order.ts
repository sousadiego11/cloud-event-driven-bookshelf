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
    readonly id: OrderDomain.Id;
    readonly userId: OrderDomain.UserId;
    readonly items: OrderDomain.Items;
    private currentStatus: OrderDomain.Status;
    readonly createdAt: Date;
    private updatedAtValue: Date;

    private constructor(id: OrderDomain.Id, userId: OrderDomain.UserId, items: OrderDomain.Items) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.currentStatus = "created";
        this.createdAt = new Date();
        this.updatedAtValue = this.createdAt;
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

    get status() {
        return this.currentStatus;
    }

    get updatedAt(): Date {
        return this.updatedAtValue;
    }

    pay(): void {
        if (this.currentStatus !== "created") {
            throw new DomainError(`Cannot pay order in status: ${this.currentStatus}`);
        }
        this.currentStatus = "paid";
        this.updatedAtValue = new Date();
    }

    cancel(): void {
        if (this.currentStatus === "paid") {
            throw new DomainError("Cannot cancel paid order");
        }
        this.currentStatus = "canceled";
        this.updatedAtValue = new Date();
    }

    ship(): void {
        if (this.currentStatus !== "paid") {
            throw new DomainError(`Cannot ship order in status: ${this.currentStatus}`);
        }
        this.currentStatus = "shipped";
        this.updatedAtValue = new Date();
    }

    toDto(): OrderDTO {
        return {
            Id: this.id,
            UserId: this.userId,
            Items: this.items.map((item) => ({ ProductId: item.productId, Quantity: item.quantity })),
            Status: this.currentStatus,
            CreatedAt: this.createdAt.toISOString(),
            UpdatedAt: this.updatedAtValue.toISOString(),
        };
    }
}
