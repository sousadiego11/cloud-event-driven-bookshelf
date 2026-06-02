import { DomainError } from "../../../domain/Error/errors";
import { Session } from "../../../domain/Session/Session";
import type { Usecase } from "../../Shared/Usecase";
import type { SessionDTO } from "../dtos/SessionDto";
import type { ISessionRepository } from "../repositories";

export type RegisterSessionInput = Pick<SessionDTO, "ConnectionId">;
export type RegisterSessionOutput = SessionDTO;

export class RegisterSessionUsecase implements Usecase<RegisterSessionInput, RegisterSessionOutput> {
    constructor(
        private readonly sessionRepository: ISessionRepository
    ) { }

    async handle(input: RegisterSessionInput): Promise<RegisterSessionOutput> {
        const existingSession = await this.sessionRepository.findByConnectionId(input.ConnectionId.trim());
        if (existingSession) {
            throw new DomainError(`Session with ConnectionId ${input.ConnectionId.trim()} already exists`);
        }

        const session = Session.register(input.ConnectionId);
        const sessionDto = session.toDto();

        await this.sessionRepository.save(sessionDto);

        return sessionDto;
    }
}
