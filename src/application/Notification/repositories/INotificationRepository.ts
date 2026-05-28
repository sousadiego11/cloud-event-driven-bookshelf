import type { NotificationDTO } from "../dtos/NotificationDto";

export interface INotificationRepository {
    save(notificationDto: NotificationDTO): Promise<void>;

    findByIdempotencyKey(idempotencyKey: string): Promise<NotificationDTO | null>;

    delete(id: string): Promise<void>;
}
