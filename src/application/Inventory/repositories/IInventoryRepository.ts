import { InventoryReservation } from "../../../domain/Inventory/Inventory";

export type InventoryReservationDTO = ReturnType<InventoryReservation['toDto']>;

export interface IInventoryRepository {
    // Create/Save operations
    save(reservationDto: InventoryReservationDTO): Promise<void>;

    // Read operations
    findById(id: string): Promise<InventoryReservationDTO | null>;
    findByOrderId(orderId: string): Promise<InventoryReservationDTO[]>;
    findByProductId(productId: string): Promise<InventoryReservationDTO[]>;
    findByOrderIdAndProductId(orderId: string, productId: string): Promise<InventoryReservationDTO | null>;

    // Update operations
    update(reservationDto: InventoryReservationDTO): Promise<void>;

    // Delete operations
    delete(id: string): Promise<void>;
}
