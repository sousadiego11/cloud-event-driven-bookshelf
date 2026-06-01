import type { BookDTO } from "../Book/dtos/BookDto";
import type { LoanDTO } from "../Loan/dtos/LoanDto";

export namespace Events {
    export enum Source {
        Books = "bookshelf.books",
        Loans = "bookshelf.loans"
    }

    export enum Names {
        BookRegistered = "BookRegistered",
        LoanRegistered = "LoanRegistered",
        LoanReturned = "LoanReturned"
    }

    export enum Queues {
        NotifyLibraryBookRegistered = "bookshelf-notify-library-book-registered",
        NotifyLibraryLoanRegistered = "bookshelf-notify-library-loan-registered",
        NotifyLibraryLoanReturned = "bookshelf-notify-library-loan-returned",
        AnalyzeDemandLoanRegistered = "bookshelf-analyze-demand-loan-registered",
    }

    export interface Mappings {
        [Events.Names.BookRegistered]: BookDTO;
        [Events.Names.LoanRegistered]: LoanDTO;
        [Events.Names.LoanReturned]: LoanDTO;
    }
}
