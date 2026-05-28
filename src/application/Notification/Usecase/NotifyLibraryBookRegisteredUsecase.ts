import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { BookDTO } from "../../Book/dtos/BookDto";
import type { Usecase } from "../../Shared/Usecase";
import type { NotificationDTO } from "../dtos/NotificationDto";
import type { INotificationRepository } from "../repositories";

export class NotifyLibraryBookRegisteredUsecase implements Usecase<BookDTO, NotificationDTO> {
    constructor(
        private readonly notificationRepository: INotificationRepository
    ) { }

    async handle(registeredBook: BookDTO): Promise<NotificationDTO> {
        const notification = Notification.register(
            registeredBook,
            `Book "${registeredBook.Title}" was registered`
        );

        const existingNotification = await this.notificationRepository.findByIdempotencyKey(notification.getIdempotencyKey());
        if (existingNotification) {
            throw new DomainError(`Notification for book ${registeredBook.Id} already registered`);
        }

        const notificationDto = notification.toDto();

        await this.notificationRepository.save(notificationDto);

        return notificationDto;
    }
}
