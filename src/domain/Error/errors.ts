export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DomainError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ReservationAlreadyConfirmedError extends DomainError {
    constructor(reservationId: string) {
        super(`Reservation ${reservationId} is already confirmed`);
        this.name = "ReservationAlreadyConfirmedError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ReservationAlreadyCanceledError extends DomainError {
    constructor(reservationId: string) {
        super(`Reservation ${reservationId} is already canceled`);
        this.name = "ReservationAlreadyCanceledError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotificationAlreadySentError extends DomainError {
    constructor(orderId: string) {
        super(`Notification for order ${orderId} already sent`);
        this.name = "NotificationAlreadySentError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}