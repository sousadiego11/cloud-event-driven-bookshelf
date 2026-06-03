import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { LoanDTO } from "../../Loan/dtos/LoanDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import type { IWebSocketPublisher } from "../../Websocket/IWebsocketPublisher";
import { Websockets } from "../../Websocket/Websockets";
import { NotificationService } from "../services";

export class NotifyLibraryLoanRegisteredUsecase implements Usecase<LoanDTO, NotificationDTO> {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly webSocketPublisher: IWebSocketPublisher
    ) { }

    async handle(registeredLoan: LoanDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            registeredLoan,
            `Loan for book "${registeredLoan.BookId}" registered for CPF ${registeredLoan.Cpf}`
        );

        const notificationDto = await this.notificationService.saveIfNotExists(notification);
        if (!notificationDto) {
            throw new DomainError(`Notification for loan ${registeredLoan.Id} already registered`);
        }

        await this.webSocketPublisher.publish(
            Websockets.Names.NotificationCreated,
            notificationDto
        );

        return notificationDto;
    }
}
