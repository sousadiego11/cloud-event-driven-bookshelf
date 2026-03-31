import { DomainError } from "../Error/errors";

type PaymentId = string;
type OrderId = string;

export type PaymentStatus = "pending" | "captured" | "refunded" | "failed";

export class Payment {
    id: PaymentId;
    orderId: OrderId;
    amount: number;
    status: PaymentStatus;
    processedAt?: Date;
    version: number = 0;

    constructor(id: PaymentId, orderId: OrderId, amount: number) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.status = "pending";
    }

    capture(): void {
        if (this.status !== "pending") throw new DomainError("Cannot capture non-pending payment");
        this.status = "captured";
        this.processedAt = new Date();
        this.version++;
    }

    refund(): void {
        if (this.status === "refunded") return; // idempotente
        if (this.status !== "captured") throw new DomainError("Cannot refund uncaptured payment");
        this.status = "refunded";
        this.processedAt = new Date();
        this.version++;
    }

    toDto() {
        return {
            id: this.id,
            orderId: this.orderId,
            amount: this.amount,
            status: this.status,
            processedAt: this.processedAt,
            version: this.version,
        };
    }
}