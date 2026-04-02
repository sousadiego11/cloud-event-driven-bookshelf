import { Notification } from "../../../domain/Notification/Notification";

export type NotificationDTO = ReturnType<Notification['toDto']>;

export interface INotificationRepository {
    // Create/Save operations
    save(notificationDto: NotificationDTO): Promise<void>;
    saveMany(notificationDtos: NotificationDTO[]): Promise<void>;

    // Read operations
    findById(id: string): Promise<NotificationDTO | null>;
    findByTarget(target: string): Promise<NotificationDTO[]>;
    findByTargetId(targetId: string): Promise<NotificationDTO[]>;
    findBySent(sent: boolean): Promise<NotificationDTO[]>;

    // Update operations
    update(notificationDto: NotificationDTO): Promise<void>;

    // Delete operations
    delete(id: string): Promise<void>;
}
