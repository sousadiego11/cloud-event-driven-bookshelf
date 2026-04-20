import type { OrderDTO, OrderItemDTO } from "../../application/Order/dtos/OrderDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

type OrderId = string;
type UserId = string;
type ProductId = string;
type Items = Array<{ productId: ProductId; quantity: number }>;

export class Order {
    readonly id: OrderId;
    readonly userId: UserId;
    readonly items: Array<{ productId: ProductId; quantity: number }>;
    private _status: "created" | "paid" | "canceled" | "shipped";
    readonly createdAt: Date;
    private _updatedAt: Date;

    private constructor(id: OrderId, userId: UserId, items: Items) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this._status = "created";
        this.createdAt = new Date();
        this._updatedAt = this.createdAt;
    }

    static createFromDto(userId: UserId, items: OrderItemDTO[]): Order {
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
        return this._status;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    pay(): void {
        if (this._status !== "created") {
            throw new DomainError(`Cannot pay order in status: ${this._status}`);
        }
        this._status = "paid";
        this._updatedAt = new Date();
    }

    cancel(): void {
        if (this._status === "paid") {
            throw new DomainError("Cannot cancel paid order");
        }
        this._status = "canceled";
        this._updatedAt = new Date();
    }

    ship(): void {
        if (this._status !== "paid") {
            throw new DomainError(`Cannot ship order in status: ${this._status}`);
        }
        this._status = "shipped";
        this._updatedAt = new Date();
    }

    toDto(): OrderDTO {
        return {
            Id: this.id,
            UserId: this.userId,
            Items: this.items.map((item) => ({ ProductId: item.productId, Quantity: item.quantity })),
            Status: this._status,
            CreatedAt: this.createdAt.toISOString(),
            UpdatedAt: this._updatedAt.toISOString(),
        };
    }
}