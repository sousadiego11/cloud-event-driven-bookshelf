import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { BookDTO } from "../../Book/dtos/BookDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import type { IWebSocketPublisher } from "../../Websocket/IWebsocketPublisher";
import { Websockets } from "../../Websocket/Websockets";
import { NotificationService } from "../services";

export class NotifyLibraryBookRegisteredUsecase implements Usecase<BookDTO, NotificationDTO> {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly webSocketPublisher: IWebSocketPublisher
    ) { }

    async handle(registeredBook: BookDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            registeredBook,
            `Book "${registeredBook.Title}" was registered`
        );

        await this.notificationService.saveIfNotExists(notification);
        await this.webSocketPublisher.publish(
            Websockets.Names.NotificationCreated,
            notification.toDto()
        );

        return notification.toDto();
    }
}
