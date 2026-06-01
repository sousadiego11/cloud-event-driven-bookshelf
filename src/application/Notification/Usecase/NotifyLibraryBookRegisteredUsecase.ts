import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { BookDTO } from "../../Book/dtos/BookDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import { NotificationService } from "../services";

export class NotifyLibraryBookRegisteredUsecase implements Usecase<BookDTO, NotificationDTO> {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    async handle(registeredBook: BookDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            registeredBook,
            `Book "${registeredBook.Title}" was registered`
        );

        const notificationDto = await this.notificationService.saveIfNotExists(notification);
        if (!notificationDto) {
            throw new DomainError(`Notification for book ${registeredBook.Id} already registered`);
        }

        return notificationDto;
    }
}
