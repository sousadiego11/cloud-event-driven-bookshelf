import type { BookDTO } from "../Book/dtos/BookDto";

export namespace Events {
    export enum Source {
        Books = "bookshelf.books"
    }

    export enum Names {
        BookRegistered = "BookRegistered"
    }

    export enum Queues {
        NotifyLibraryBookRegistered = "bookshelf-notify-library-book-registered"
    }

    export interface Mappings {
        [Events.Names.BookRegistered]: BookDTO;
    }
}
