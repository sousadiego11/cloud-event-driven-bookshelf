import type { InventoryReservation } from "../Inventory/Inventory";
import type { Order } from "../Order/Order";

export type NotificationTarget = "user" | "warehouse";

export class Notification {
    id: string;
    target: NotificationTarget;
    targetId: string;
    message: string;
    sentAt?: Date;

    constructor(id: string, target: NotificationTarget, targetId: string, message: string) {
        this.id = id;
        this.target = target;
        this.targetId = targetId;
        this.message = message;
    }

    send(): void {
        if (this.sentAt) return;
        this.sentAt = new Date();
    }

    toDto() {
        return {
            id: this.id,
            target: this.target,
            targetId: this.targetId,
            message: this.message,
            sentAt: this.sentAt,
        };
    }
}

export class NotificationFactory {
    static forOrderCreated(order: ReturnType<Order["toDto"]>): Notification[] {
        return [
            new Notification(
                `notify-user-${order.id}`,
                "user",
                order.userId,
                `Seu pedido ${order.id} foi criado com sucesso!`
            ),
            new Notification(
                `notify-warehouse-${order.id}`,
                "warehouse",
                "warehouse-1",
                `Novo pedido ${order.id} aguardando processamento.`
            ),
        ];
    }

    static forOrderPaid(order: ReturnType<Order["toDto"]>): Notification[] {
        return [
            new Notification(
                `notify-user-${order.id}-paid`,
                "user",
                order.userId,
                `Pagamento do pedido ${order.id} confirmado! Preparando envio.`
            ),
        ];
    }

    static forInventoryReserved(reservation: ReturnType<InventoryReservation["toDto"]>): Notification[] {
        return [
            new Notification(
                `notify-warehouse-inv-${reservation.id}`,
                "warehouse",
                "warehouse-1",
                `Estoque reservado para pedido ${reservation.orderId}: ${reservation.quantity} x ${reservation.productId}`
            ),
        ];
    }
}