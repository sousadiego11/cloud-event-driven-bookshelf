import type { OrderDTO } from "../../application/Order/dtos/OrderDto";
import type { NotificationDTO } from "../../application/Notification/repositories/INotificationRepository";
import { Id } from "../../application/Shared/Id";

export namespace NotificationDomain {
    export type Id = string;
    export type UserId = string;
    export type Message = string;
}

export class Notification {
    id: NotificationDomain.Id;
    userId: NotificationDomain.UserId;
    message: NotificationDomain.Message;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(order: OrderDTO, message: NotificationDomain.Message) {
        this.id = Id.hash(order).getValue();
        this.userId = order.UserId;
        this.message = message;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    send(): void {
        if (this.sentAt) return;
        this.sentAt = new Date();
        this.updatedAt = new Date();
    }

    toDto(): NotificationDTO {
        return {
            Id: this.id,
            UserId: this.userId,
            Message: this.message,
            SentAt: this.sentAt?.toISOString(),
            CreatedAt: this.createdAt.toISOString(),
            UpdatedAt: this.updatedAt.toISOString(),
        };
    }
}

export class NotificationFactory {
    static forOrderCreated(order: OrderDTO): Notification {
        return new Notification(
            order,
            `Seu pedido ${order.Id} foi criado com sucesso!`
        )
    }
}
