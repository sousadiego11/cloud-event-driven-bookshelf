import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

type OrderId = string;
type UserId = string;
type ProductId = string;

export type OrderStatus = "created" | "paid" | "canceled" | "shipped";

export interface OrderItem {
    productId: ProductId;
    quantity: number;
}

export class Order {
    id: OrderId;
    userId: UserId;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;

    private constructor(id: OrderId, userId: UserId, items: OrderItem[]) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.status = "created";
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    static create(userId: UserId, items: OrderItem[]): Order {
        const id = Id.generate();
        return new Order(id.getValue(), userId, items);
    }

    pay(): void {
        if (this.status !== "created") throw new DomainError("Cannot pay non-created order");
        this.status = "paid";
        this.updatedAt = new Date();
    }

    cancel(): void {
        if (this.status === "paid") throw new DomainError("Cannot cancel paid order");
        this.status = "canceled";
        this.updatedAt = new Date();
    }

    ship(): void {
        if (this.status !== "paid") throw new DomainError("Cannot ship non-paid order");
        this.status = "shipped";
        this.updatedAt = new Date();
    }

    toDto() {
        return {
            Id: this.id,
            UserId: this.userId,
            Items: this.items,
            Status: this.status,
            CreatedAt: this.createdAt.toISOString(),
            UpdatedAt: this.updatedAt.toISOString(),
        };
    }
}