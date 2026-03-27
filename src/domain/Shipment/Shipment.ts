
type ShipmentId = string;

export type ShipmentStatus = "pending" | "shipped" | "delivered";

export class Shipment {
    id: ShipmentId;
    orderId: string;
    carrier: string;
    trackingNumber: string;
    status: ShipmentStatus;
    shippedAt?: Date;
    deliveredAt?: Date;

    constructor(
        id: ShipmentId,
        orderId: string,
        carrier: string,
        trackingNumber: string,
        status: ShipmentStatus,
        shippedAt?: Date,
        deliveredAt?: Date
    ) {
        this.id = id;
        this.orderId = orderId;
        this.carrier = carrier;
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
    }

    toDto() {
        return {
            id: this.id,
            orderId: this.orderId,
            carrier: this.carrier,
            trackingNumber: this.trackingNumber,
            status: this.status,
            shippedAt: this.shippedAt,
            deliveredAt: this.deliveredAt,
        };
    }
}