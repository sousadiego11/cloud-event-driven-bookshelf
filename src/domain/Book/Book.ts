import type { BookDTO } from "../../application/Book/dtos/BookDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

export namespace BookDomain {
    export type Id = string;
    export type Title = string;
    export type Author = string;
    export type Isbn = string;
}

export class Book {
    readonly #id: BookDomain.Id;
    readonly #title: BookDomain.Title;
    readonly #author: BookDomain.Author;
    readonly #isbn: BookDomain.Isbn;
    readonly #registeredAt: Date;
    #updatedAt: Date;

    private constructor(
        id: BookDomain.Id,
        title: BookDomain.Title,
        author: BookDomain.Author,
        isbn: BookDomain.Isbn,
        registeredAt: Date
    ) {
        this.#id = id;
        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
        this.#registeredAt = registeredAt;
        this.#updatedAt = registeredAt;
    }

    static register(title: BookDomain.Title, author: BookDomain.Author, isbn: BookDomain.Isbn): Book {
        const normalizedTitle = title.trim();
        const normalizedAuthor = author.trim();
        const normalizedIsbn = isbn.trim();

        if (!normalizedTitle) {
            throw new DomainError("Title cannot be empty");
        }

        if (!normalizedAuthor) {
            throw new DomainError("Author cannot be empty");
        }

        if (!normalizedIsbn) {
            throw new DomainError("Isbn cannot be empty");
        }

        const id = Id.generate();
        return new Book(id.getValue(), normalizedTitle, normalizedAuthor, normalizedIsbn, new Date());
    }

    toDto(): BookDTO {
        return {
            Id: this.#id,
            Title: this.#title,
            Author: this.#author,
            Isbn: this.#isbn,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }
}
