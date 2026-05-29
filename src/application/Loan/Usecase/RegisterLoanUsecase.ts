import { DomainError } from "../../../domain/Error/errors";
import { Inventory } from "../../../domain/Inventory/Inventory";
import { Loan } from "../../../domain/Loan/Loan";
import type { IEventPublisher } from "../../Event/EventPublisher";
import { Events } from "../../Event/Events";
import type { IInventoryRepository } from "../../Inventory/repositories";
import type { Usecase } from "../../Shared/Usecase";
import type { LoanDTO } from "../dtos/LoanDto";
import type { ILoanRepository } from "../repositories";

export type RegisterLoanInput = Pick<LoanDTO, "BookId" | "Cpf">;

export class RegisterLoanUsecase implements Usecase<RegisterLoanInput, LoanDTO> {
    constructor(
        private readonly loanRepository: ILoanRepository,
        private readonly inventoryRepository: IInventoryRepository,
        private readonly eventPublisher: IEventPublisher
    ) { }

    async handle(input: RegisterLoanInput): Promise<LoanDTO> {
        const existingLoan = await this.loanRepository.findByBookForCpf(input.BookId, input.Cpf)
        if (existingLoan) {
            throw new DomainError(`Cpf ${input.Cpf} already has a loan for book ${input.BookId}`);
        }

        const existingInventory = await this.inventoryRepository.findByBookId(input.BookId);
        if (!existingInventory) {
            throw new DomainError(`There is no inventory for Book ${input.BookId}`);
        }

        const inventory = Inventory.fromDto(existingInventory);
        inventory.lendOne();

        const loan = Loan.register(input.BookId, input.Cpf);
        const loanDto = loan.toDto();

        await this.loanRepository.save(loanDto);
        await this.inventoryRepository.save(inventory.toDto())

        await this.eventPublisher.publish(Events.Source.Loans, Events.Names.LoanRegistered, loanDto);

        return loanDto;
    }
}
