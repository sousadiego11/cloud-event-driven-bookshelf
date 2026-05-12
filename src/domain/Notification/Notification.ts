import type { Order } from "../Order/Order";

export class Notification {
    id: string;
    userId: string;
    message: string;
    sentAt?: Date;

    constructor(id: string, userId: string, message: string) {
        this.id = id;
        this.userId = userId;
        this.message = message;
    }

    send(): void {
        if (this.sentAt) return;
        this.sentAt = new Date();
    }

    toDto() {
        return {
            id: this.id,
            userId: this.userId,
            message: this.message,
            sentAt: this.sentAt,
        };
    }
}

export class NotificationFactory {
    static forOrderCreated(order: ReturnType<Order["toDto"]>): Notification[] {
        return [
            new Notification(
                `notify-user-${order.Id}`,
                order.UserId,
                `Seu pedido ${order.Id} foi criado com sucesso!`
            )
        ];
    }

    static forOrderPaid(order: ReturnType<Order["toDto"]>): Notification[] {
        return [
            new Notification(
                `notify-user-${order.Id}-paid`,
                order.UserId,
                `Pagamento do pedido ${order.Id} confirmado! Preparando envio.`
            )
        ];
    }
}