import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { LoanDTO } from "../../Loan/dtos/LoanDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import type { INotificationRepository } from "../repositories";

export class NotifyLibraryLoanRegisteredUsecase implements Usecase<LoanDTO, NotificationDTO> {
    constructor(
        private readonly notificationRepository: INotificationRepository
    ) { }

    async handle(registeredLoan: LoanDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            registeredLoan,
            `Loan for book "${registeredLoan.BookId}" registered for CPF ${registeredLoan.Cpf}`
        );

        const existingNotification = await this.notificationRepository.findByIdempotencyKey(notification.getIdempotencyKey());
        if (existingNotification) {
            throw new DomainError(`Notification for loan ${registeredLoan.Id} already registered`);
        }

        const notificationDto = notification.toDto();

        await this.notificationRepository.save(notificationDto);

        return notificationDto;
    }
}
