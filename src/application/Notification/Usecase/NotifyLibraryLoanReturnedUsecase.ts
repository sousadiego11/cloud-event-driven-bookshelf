import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { LoanDTO } from "../../Loan/dtos/LoanDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import type { IWebSocketPublisher } from "../../Websocket/IWebsocketPublisher";
import { Websockets } from "../../Websocket/Websockets";
import { NotificationService } from "../services";

export class NotifyLibraryLoanReturnedUsecase implements Usecase<LoanDTO, NotificationDTO> {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly webSocketPublisher: IWebSocketPublisher
    ) { }

    async handle(returnedLoan: LoanDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            returnedLoan,
            `Loan for book "${returnedLoan.BookId}" returned for CPF ${returnedLoan.Cpf}`
        );

        await this.notificationService.saveIfNotExists(notification);
        await this.webSocketPublisher.publish(
            Websockets.Names.NotificationCreated,
            notification.toDto()
        );

        return notification.toDto();
    }
}
