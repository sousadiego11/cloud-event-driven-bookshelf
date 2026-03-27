export type NotificationTarget = "user" | "warehouse";

export class Notification {
    target: NotificationTarget;
    targetId: string;
    message: string;

    constructor(target: NotificationTarget, targetId: string, message: string) {
        this.target = target;
        this.targetId = targetId;
        this.message = message;
    }

    toDto() {
        return {
            target: this.target,
            targetId: this.targetId,
            message: this.message,
        };
    }
}