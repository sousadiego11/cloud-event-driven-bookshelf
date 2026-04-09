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
    paymentId?: string;
    shipmentId?: string;

    private constructor(id: OrderId, userId: UserId, items: OrderItem[]) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.status = "created";
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    static create(id: OrderId, userId: UserId, items: OrderItem[]): Order {
        return new Order(id, userId, items);
    }

    pay(paymentId: string): void {
        if (this.status !== "created") throw new DomainError("Cannot pay non-created order");
        this.status = "paid";
        this.paymentId = paymentId;
        this.updatedAt = new Date();
    }

    cancel(reason: string): void {
        if (this.status === "paid") throw new DomainError("Cannot cancel paid order");
        this.status = "canceled";
        this.updatedAt = new Date();
    }

    ship(shipmentId: string): void {
        if (this.status !== "paid") throw new DomainError("Cannot ship non-paid order");
        this.status = "shipped";
        this.shipmentId = shipmentId;
        this.updatedAt = new Date();
    }

    toDto() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            paymentId: this.paymentId,
            shipmentId: this.shipmentId,
        };
    }
}