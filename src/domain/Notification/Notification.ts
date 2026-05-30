import type { NotificationDTO } from "../../application/Notification/dtos/NotificationDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

export namespace NotificationDomain {
    export type Id = string;
    export type Identity = Record<string, any>;
    export type IdempotencyKey = string;
    export type Message = string;
}

export class Notification {
    readonly #id: NotificationDomain.Id;
    readonly #idempotencyKey: NotificationDomain.IdempotencyKey;
    readonly #message: NotificationDomain.Message;
    readonly #registeredAt: Date;
    #updatedAt: Date;

    private constructor(
        id: NotificationDomain.Id,
        idempotencyKey: NotificationDomain.IdempotencyKey,
        message: NotificationDomain.Message,
        registeredAt: Date,
        updatedAt: Date
    ) {
        this.#id = id;
        this.#idempotencyKey = idempotencyKey;
        this.#message = message;
        this.#registeredAt = registeredAt;
        this.#updatedAt = updatedAt;
    }

    static register(
        identity: NotificationDomain.Identity,
        message: NotificationDomain.Message
    ): Notification {
        const idempotencyKey = Id.hash(identity);
        const normalizedIdempotencyKey = idempotencyKey.trim();
        const normalizedMessage = message.trim();

        if (!normalizedIdempotencyKey) {
            throw new DomainError("IdempotencyKey cannot be empty");
        }

        if (!normalizedMessage) {
            throw new DomainError("Message cannot be empty");
        }

        const id = Id.generate();
        const registeredAt = new Date();

        return new Notification(
            id.getValue(),
            normalizedIdempotencyKey,
            normalizedMessage,
            registeredAt,
            registeredAt
        );
    }

    static fromDto(notificationDto: NotificationDTO): Notification {
        return new Notification(
            notificationDto.Id,
            notificationDto.IdempotencyKey,
            notificationDto.Message,
            new Date(notificationDto.RegisteredAt),
            new Date(notificationDto.UpdatedAt)
        );
    }

    getIdempotencyKey(): NotificationDomain.IdempotencyKey {
        return this.#idempotencyKey;
    }

    toDto(): NotificationDTO {
        return {
            Id: this.#id,
            IdempotencyKey: this.#idempotencyKey,
            Message: this.#message,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }

    static forHighBookDemand(bookId: string, loanCount: number, periodDays: number, copies: number, ratio: number): Notification {
        const message =
            `High demand detected for book ${bookId}. ` +
            `${loanCount} loans in ${periodDays} days ` +
            `out of ${copies} copies ` +
            `Consider purchasing more copies.`;

        return Notification.register({ bookId, demandRatio: ratio }, message);
    }
}
