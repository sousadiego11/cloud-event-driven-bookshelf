import { Shipment } from "../../../domain/Shipment/Shipment";

export type ShipmentDTO = ReturnType<Shipment['toDto']>;

export interface IShipmentRepository {
    // Create/Save operations
    save(shipmentDto: ShipmentDTO): Promise<void>;

    // Read operations
    findById(id: string): Promise<ShipmentDTO | null>;
    findByOrderId(orderId: string): Promise<ShipmentDTO | null>;
    findByStatus(status: string): Promise<ShipmentDTO[]>;
    findByCarrier(carrier: string): Promise<ShipmentDTO[]>;

    // Update operations
    update(shipmentDto: ShipmentDTO): Promise<void>;

    // Delete operations
    delete(id: string): Promise<void>;
}
