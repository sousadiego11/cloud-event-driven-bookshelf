type NotificationId = string;
type ReservationId = string;

enum NotificationType {
    Created = "created",
    Confirmed = "confirmed",
    Canceled = "canceled",
}

enum NotificationStatus {
    Pending = "pending",
    Sent = "sent",
    Failed = "failed",
}

export interface NotificationDto {
    id: NotificationId;
    reservationId: ReservationId;
    type: NotificationType;
    recipientEmail: string;
    status: NotificationStatus;
    sentAt: Date | null;
    error: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Notification {
    private props: NotificationProps;

    private constructor(props: NotificationProps) {
        this.props = props;
    }

    static forReservationEvent(
        id: NotificationId,
        reservationId: ReservationId,
        type: NotificationType,
        recipientEmail: string
    ): Notification {
        return new Notification({
            id,
            reservationId,
            type,
            recipientEmail,
            status: NotificationStatus.Pending,
            sentAt: null,
            error: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    markAsSent(sentAt: Date): void {
        if (this.props.status === NotificationStatus.Sent) {
            return;
        }

        this.props.status = NotificationStatus.Sent;
        this.props.sentAt = sentAt;
        this.props.updatedAt = new Date();
    }

    markAsFailed(error: string): void {
        this.props.status = NotificationStatus.Failed;
        this.props.error = error;
        this.props.updatedAt = new Date();
    }

    toDto(): NotificationDto {
        return {
            id: this.props.id,
            reservationId: this.props.reservationId,
            type: this.props.type,
            recipientEmail: this.props.recipientEmail,
            status: this.props.status,
            sentAt: this.props.sentAt,
            error: this.props.error,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}

interface NotificationProps extends NotificationDto { }