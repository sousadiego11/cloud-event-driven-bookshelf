import type { BookDTO } from "../dtos/BookDto";

export interface IBookRepository {
    save(bookDto: BookDTO): Promise<void>;

    delete(id: string): Promise<void>;
}
