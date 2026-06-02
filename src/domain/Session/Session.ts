import type { SessionDTO } from "../../application/Session/dtos/SessionDto";
import { Id } from "../../application/Shared/Id";
import { DomainError } from "../Error/errors";

export namespace SessionDomain {
    export type Id = string;
    export type ConnectionId = string;
    export type Status = "active" | "closed";
}

export class Session {
    readonly #id: SessionDomain.Id;
    readonly #connectionId: SessionDomain.ConnectionId;
    #status: SessionDomain.Status;
    readonly #registeredAt: Date;
    #updatedAt: Date;

    private constructor(
        id: SessionDomain.Id,
        connectionId: SessionDomain.ConnectionId,
        status: SessionDomain.Status,
        registeredAt: Date,
        updatedAt: Date
    ) {
        this.#id = id;
        this.#connectionId = connectionId;
        this.#status = status;
        this.#registeredAt = registeredAt;
        this.#updatedAt = updatedAt;
    }

    static register(connectionId: SessionDomain.ConnectionId): Session {
        const normalizedConnectionId = connectionId.trim();

        if (!normalizedConnectionId) {
            throw new DomainError("ConnectionId cannot be empty");
        }

        const id = Id.generate();
        const registeredAt = new Date();

        return new Session(
            id.getValue(),
            normalizedConnectionId,
            "active",
            registeredAt,
            registeredAt
        );
    }

    static fromDto(sessionDto: SessionDTO): Session {
        return new Session(
            sessionDto.Id,
            sessionDto.ConnectionId,
            sessionDto.Status,
            new Date(sessionDto.RegisteredAt),
            new Date(sessionDto.UpdatedAt)
        );
    }

    close(): void {
        if (this.#status === "closed") {
            throw new DomainError("Session already closed");
        }

        this.#status = "closed";
        this.#updatedAt = new Date();
    }

    getId(): SessionDomain.Id {
        return this.#id;
    }

    getConnectionId(): SessionDomain.ConnectionId {
        return this.#connectionId;
    }

    toDto(): SessionDTO {
        return {
            Id: this.#id,
            ConnectionId: this.#connectionId,
            Status: this.#status,
            RegisteredAt: this.#registeredAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }
}
