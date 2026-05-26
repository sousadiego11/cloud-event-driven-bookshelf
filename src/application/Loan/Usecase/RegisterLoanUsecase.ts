import { Loan } from "../../../domain/Loan/Loan";
import type { IEventPublisher } from "../../Event/EventPublisher";
import { Events } from "../../Event/Events";
import type { Usecase } from "../../Shared/Usecase";
import type { LoanDTO } from "../dtos/LoanDto";
import type { ILoanRepository } from "../repositories";

export type RegisterLoanInput = Pick<LoanDTO, "BookId" | "Cpf">;

export class RegisterLoanUsecase implements Usecase<RegisterLoanInput, LoanDTO> {
    constructor(
        private readonly loanRepository: ILoanRepository,
        private readonly eventPublisher: IEventPublisher
    ) { }

    async handle(input: RegisterLoanInput): Promise<LoanDTO> {
        const loan = Loan.register(input.BookId, input.Cpf);
        const loanDto = loan.toDto();

        await this.loanRepository.save(loanDto);
        await this.eventPublisher.publish(Events.Source.Loans, Events.Names.LoanRegistered, loanDto);

        return loanDto;
    }
}
