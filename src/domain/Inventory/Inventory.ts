type ProductIdInventory = string;
type OrderId = string;

export class InventoryReservation {
    id: string;
    productId: ProductIdInventory;
    orderId: OrderId;
    quantity: number;
    status: "reserved" | "released";
    createdAt: Date;

    private constructor(id: string, productId: ProductIdInventory, orderId: OrderId, quantity: number) {
        this.id = id;
        this.productId = productId;
        this.orderId = orderId;
        this.quantity = quantity;
        this.status = "reserved";
        this.createdAt = new Date();
    }

    static create(id: string, productId: ProductIdInventory, orderId: OrderId, quantity: number): InventoryReservation {
        return new InventoryReservation(id, productId, orderId, quantity);
    }

    release(): void {
        if (this.status === "released") return;
        this.status = "released";
    }

    toDto() {
        return {
            id: this.id,
            productId: this.productId,
            orderId: this.orderId,
            quantity: this.quantity,
            status: this.status,
            createdAt: this.createdAt,
        };
    }
}