import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { LoanDTO } from "../../Loan/dtos/LoanDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import { NotificationService } from "../services";

export class NotifyLibraryLoanReturnedUsecase implements Usecase<LoanDTO, NotificationDTO> {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    async handle(returnedLoan: LoanDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            returnedLoan,
            `Loan for book "${returnedLoan.BookId}" returned for CPF ${returnedLoan.Cpf}`
        );

        const notificationDto = await this.notificationService.saveIfNotExists(notification);
        if (!notificationDto) {
            throw new DomainError(`Notification for loan return ${returnedLoan.Id} already registered`);
        }

        return notificationDto;
    }
}
