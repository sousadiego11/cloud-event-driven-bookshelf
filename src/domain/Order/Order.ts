type OrderId = string;
type UserId = string;
type ProductId = string;

export type OrderStatus = "created" | "paid" | "canceled";

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

    constructor(
        id: OrderId,
        userId: UserId,
        items: OrderItem[],
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toDto() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}