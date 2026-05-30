import { Book } from "../../../domain/Book/Book";
import { DomainError } from "../../../domain/Error/errors";
import { Inventory } from "../../../domain/Inventory/Inventory";
import type { IEventPublisher } from "../../Event/EventPublisher";
import { Events } from "../../Event/Events";
import type { IInventoryRepository } from "../../Inventory/repositories";
import type { Usecase } from "../../Shared/Usecase";
import type { BookDTO } from "../dtos/BookDto";
import type { IBookRepository } from "../repositories";

export type RegisterBookInput = Pick<BookDTO, "Title" | "Author" | "Isbn"> & { Stock: number }
export type RegisterBookOutput = BookDTO

export class RegisterBookUsecase implements Usecase<RegisterBookInput, RegisterBookOutput> {
    constructor(
        private readonly bookRepository: IBookRepository,
        private readonly inventoryRepository: IInventoryRepository,
        private readonly eventPublisher: IEventPublisher
    ) { }

    async handle(input: RegisterBookInput): Promise<RegisterBookOutput> {
        const registeredBook = await this.bookRepository.findByIsbn(input.Isbn.trim());
        if (registeredBook) {
            throw new DomainError(`Book with Isbn ${input.Isbn.trim()} already exists`);
        }

        const book = Book.register(input.Title, input.Author, input.Isbn);
        const bookDto = book.toDto();

        const inventory = Inventory.register(bookDto.Id, input.Stock);
        const inventoryDto = inventory.toDto();

        await this.bookRepository.save(bookDto);
        await this.inventoryRepository.save(inventoryDto);
        await this.eventPublisher.publish(Events.Source.Books, Events.Names.BookRegistered, bookDto);

        return bookDto
    }
}
