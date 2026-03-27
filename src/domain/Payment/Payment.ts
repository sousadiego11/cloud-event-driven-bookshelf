type PaymentId = string;

export type PaymentStatus = "pending" | "completed" | "failed";

export class Payment {
    id: PaymentId;
    orderId: string;
    amount: number;
    status: PaymentStatus;
    processedAt?: Date;

    constructor(id: PaymentId, orderId: string, amount: number, status: PaymentStatus, processedAt?: Date) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.status = status;
        this.processedAt = processedAt;
    }

    toDto() {
        return {
            id: this.id,
            orderId: this.orderId,
            amount: this.amount,
            status: this.status,
            processedAt: this.processedAt,
        };
    }
}