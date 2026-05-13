import { Notification } from "../../../domain/Notification/Notification";

export type NotificationDTO = ReturnType<Notification['toDto']>;

export interface INotificationRepository {
    save(notificationDto: NotificationDTO): Promise<void>;

    findById(id: string): Promise<NotificationDTO>;

    delete(id: string): Promise<void>;
}
