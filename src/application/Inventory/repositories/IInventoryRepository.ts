export interface InventoryDTO {
    Id: string;
    ProductId: string;
    Total: number;
    Reserved: number;
    Available: number;
}

export interface IInventoryRepository {
    // Create/Save operations
    save(inventoryDto: InventoryDTO): Promise<void>;

    // Read operations
    findById(id: string): Promise<InventoryDTO | null>;
    findByProductId(productId: string): Promise<InventoryDTO[]>;

    // Update operations
    update(inventoryDto: InventoryDTO): Promise<void>;

    // Delete operations
    delete(id: string): Promise<void>;
}
