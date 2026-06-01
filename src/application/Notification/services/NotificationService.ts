import type { Notification } from "../../../domain/Notification/Notification";
import type { NotificationDTO } from "../dtos/NotificationDto";
import type { INotificationRepository } from "../repositories";

export class NotificationService {
    constructor(
        private readonly notificationRepository: INotificationRepository
    ) { }

    async saveIfNotExists(notification: Notification): Promise<NotificationDTO | null> {
        const alreadyNotified = await this.notificationRepository.findByIdempotencyKey(notification.getIdempotencyKey());
        if (alreadyNotified) return null;

        const notificationDto = notification.toDto();
        await this.notificationRepository.save(notificationDto);

        return notificationDto;
    }
}
