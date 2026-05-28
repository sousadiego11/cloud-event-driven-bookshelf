import type { BookDTO } from "../dtos/BookDto";

export interface IBookRepository {
    save(bookDto: BookDTO): Promise<void>;

    findByIsbn(isbn: string): Promise<BookDTO | null>;

    delete(id: string): Promise<void>;
}
