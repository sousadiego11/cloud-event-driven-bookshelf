import type { OrderDTO } from "../../application/Order/dtos/OrderDto";
import { Id } from "../../application/Shared/Id";
import type { Order } from "../Order/Order";

export class Notification {
    id: string;
    userId: string;
    message: string;
    sentAt?: Date;
    createdAt: Date;
    _updatedAt: Date;

    constructor(order: OrderDTO, message: string) {
        this.id = Id.hash(order).getValue();
        this.userId = order.UserId;
        this.message = message;
        this.createdAt = new Date();
        this._updatedAt = new Date();
    }

    send(): void {
        if (this.sentAt) return;
        this.sentAt = new Date();
        this._updatedAt = new Date();
    }

    toDto() {
        return {
            id: this.id,
            userId: this.userId,
            message: this.message,
            sentAt: this.sentAt?.toISOString(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
        };
    }
}

export class NotificationFactory {
    static forOrderCreated(order: ReturnType<Order["toDto"]>): Notification {
        return new Notification(
            order,
            `Seu pedido ${order.Id} foi criado com sucesso!`
        )
    }
}