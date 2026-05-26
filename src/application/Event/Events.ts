import type { BookDTO } from "../Book/dtos/BookDto";
import type { LoanDTO } from "../Loan/dtos/LoanDto";

export namespace Events {
    export enum Source {
        Books = "bookshelf.books",
        Loans = "bookshelf.loans"
    }

    export enum Names {
        BookRegistered = "BookRegistered",
        LoanRegistered = "LoanRegistered"
    }

    export enum Queues {
        NotifyLibraryBookRegistered = "bookshelf-notify-library-book-registered"
    }

    export interface Mappings {
        [Events.Names.BookRegistered]: BookDTO;
        [Events.Names.LoanRegistered]: LoanDTO;
    }
}
