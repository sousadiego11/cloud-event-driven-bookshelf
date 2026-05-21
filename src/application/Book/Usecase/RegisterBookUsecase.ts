import { Book } from "../../../domain/Book/Book";
import type { IEventPublisher } from "../../Event/EventPublisher";
import { Events } from "../../Event/Events";
import type { Usecase } from "../../Shared/Usecase";
import type { BookDTO } from "../dtos/BookDto";
import type { IBookRepository } from "../repositories";

export type RegisterBookInput = Pick<BookDTO, "Title" | "Author" | "Isbn">;

export class RegisterBookUsecase implements Usecase<RegisterBookInput, BookDTO> {
    constructor(
        private readonly bookRepository: IBookRepository,
        private readonly eventPublisher: IEventPublisher
    ) { }

    async handle(input: RegisterBookInput): Promise<BookDTO> {
        const book = Book.register(input.Title, input.Author, input.Isbn);
        const bookDto = book.toDto();

        await this.bookRepository.save(bookDto);
        await this.eventPublisher.publish(Events.Source.Books, Events.Names.BookRegistered, bookDto);

        return bookDto;
    }
}
