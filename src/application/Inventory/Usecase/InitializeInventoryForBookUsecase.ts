import { DomainError } from "../../../domain/Error/errors";
import { Inventory } from "../../../domain/Inventory/Inventory";
import type { BookDTO } from "../../Book/dtos/BookDto";
import type { Usecase } from "../../Shared/Usecase";
import type { InventoryDTO } from "../dtos/InventoryDto";
import type { IInventoryRepository } from "../repositories";

export class InitializeInventoryForBookUsecase implements Usecase<BookDTO, InventoryDTO> {
    constructor(
        private readonly inventoryRepository: IInventoryRepository
    ) { }

    async handle(createdBook: BookDTO): Promise<InventoryDTO> {
        const existingInventory = await this.inventoryRepository.findByBookId(createdBook.Id);
        if (existingInventory) throw new DomainError(`Inventory for book ${createdBook.Id} already initialized`)

        const inventory = Inventory.register(createdBook.Id, 0);
        const inventoryDto = inventory.toDto();

        await this.inventoryRepository.save(inventoryDto);

        return inventoryDto;
    }
}