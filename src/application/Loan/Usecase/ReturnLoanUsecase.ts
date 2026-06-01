import { DomainError } from "../../../domain/Error/errors";
import { Inventory } from "../../../domain/Inventory/Inventory";
import { Loan } from "../../../domain/Loan/Loan";
import type { IEventPublisher } from "../../Event/EventPublisher";
import { Events } from "../../Event/Events";
import type { IInventoryRepository } from "../../Inventory/repositories";
import type { Usecase } from "../../Shared/Usecase";
import type { LoanDTO } from "../dtos/LoanDto";
import type { ILoanRepository } from "../repositories";

export type ReturnLoanInput = Pick<LoanDTO, "BookId" | "Cpf">;

export class ReturnLoanUsecase implements Usecase<ReturnLoanInput, LoanDTO> {
    constructor(
        private readonly loanRepository: ILoanRepository,
        private readonly inventoryRepository: IInventoryRepository,
        private readonly eventPublisher: IEventPublisher
    ) { }

    async handle(input: ReturnLoanInput): Promise<LoanDTO> {
        const existingLoan = await this.loanRepository.findByBookForCpf(input.BookId, input.Cpf);
        if (!existingLoan) {
            throw new DomainError(`There is no active loan for Book ${input.BookId} and Cpf ${input.Cpf}`);
        }

        const existingInventory = await this.inventoryRepository.findByBookId(input.BookId);
        if (!existingInventory) {
            throw new DomainError(`There is no inventory for Book ${input.BookId}`);
        }

        const loan = Loan.fromDto(existingLoan);
        loan.returnNow();

        const inventory = Inventory.fromDto(existingInventory);
        inventory.returnOne();

        const loanDto = loan.toDto();

        await this.loanRepository.save(loanDto);
        await this.inventoryRepository.save(inventory.toDto());

        await this.eventPublisher.publish(Events.Source.Loans, Events.Names.LoanReturned, loanDto);

        return loanDto;
    }
}
