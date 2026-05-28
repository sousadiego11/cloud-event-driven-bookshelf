import type { InventoryDTO } from "../dtos/InventoryDto";

export interface IInventoryRepository {
    save(inventoryDto: InventoryDTO): Promise<void>;

    findByBookId(bookId: string): Promise<InventoryDTO | null>;

    delete(id: string): Promise<void>;
}
