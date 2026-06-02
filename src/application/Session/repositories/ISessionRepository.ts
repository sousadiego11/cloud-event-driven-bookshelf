import type { SessionDTO } from "../dtos/SessionDto";

export interface ISessionRepository {
    save(sessionDto: SessionDTO): Promise<void>;

    findByConnectionId(connectionId: string): Promise<SessionDTO | null>;

    findByUserId(userId: string): Promise<SessionDTO[]>;

    findByUserIdAndStatus(userId: string, status: SessionDTO["Status"]): Promise<SessionDTO[]>;

    findByUserIdRegisteredAfter(userId: string, registeredAt: string): Promise<SessionDTO[]>;

    findByUserIdUpdatedAfter(userId: string, updatedAt: string): Promise<SessionDTO[]>;

    delete(id: string): Promise<void>;
}
