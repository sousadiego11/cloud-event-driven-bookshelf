export interface NotificationDTO {
    Id: string;
    UserId: string;
    Message: string;
    SentAt?: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface INotificationRepository {
    save(notificationDto: NotificationDTO): Promise<void>;

    findById(id: string): Promise<NotificationDTO | null>;

    delete(id: string): Promise<void>;
}
