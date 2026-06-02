import type { SessionDTO } from "../dtos/SessionDto";

export interface ISessionRepository {
    save(sessionDto: SessionDTO): Promise<void>;

    findByConnectionId(connectionId: string): Promise<SessionDTO | null>;

    findByStatus(status: SessionDTO["Status"]): Promise<SessionDTO[]>;

    findByRegisteredAt(registeredAt: string): Promise<SessionDTO[]>;

    findByUpdatedAt(updatedAt: string): Promise<SessionDTO[]>;

    delete(id: string): Promise<void>;
}
