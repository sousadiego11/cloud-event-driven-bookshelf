type ShipmentId = string;
type OrderId = string;

export type ShipmentStatus = "pending" | "confirmed";

export class Shipment {
    id: ShipmentId;
    orderId: OrderId;
    carrier: string;
    trackingNumber: string;
    status: ShipmentStatus;
    confirmedAt?: Date;

    constructor(id: ShipmentId, orderId: OrderId, carrier: string, trackingNumber: string) {
        this.id = id;
        this.orderId = orderId;
        this.carrier = carrier;
        this.trackingNumber = trackingNumber;
        this.status = "pending";
    }

    confirm(): void {
        if (this.status === "confirmed") return;
        this.status = "confirmed";
        this.confirmedAt = new Date();
    }

    toDto() {
        return {
            id: this.id,
            orderId: this.orderId,
            carrier: this.carrier,
            trackingNumber: this.trackingNumber,
            status: this.status,
            confirmedAt: this.confirmedAt,
        };
    }
}