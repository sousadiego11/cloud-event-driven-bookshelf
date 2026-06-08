export interface LoanDTO {
    Id: string;
    BookId: string;
    Cpf: string;
    RegisteredAt: string;
    UpdatedAt: string;
    ReturnedAt?: string;
    Returned: "true" | "false";
    DueDate: string
}
