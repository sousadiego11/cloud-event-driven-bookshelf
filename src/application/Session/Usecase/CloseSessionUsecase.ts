import { DomainError } from "../../../domain/Error/errors";
import { Session } from "../../../domain/Session/Session";
import type { Usecase } from "../../Shared/Usecase";
import type { SessionDTO } from "../dtos/SessionDto";
import type { ISessionRepository } from "../repositories";

export type CloseSessionInput = Pick<SessionDTO, "ConnectionId">;
export type CloseSessionOutput = SessionDTO;

export class CloseSessionUsecase implements Usecase<CloseSessionInput, CloseSessionOutput> {
    constructor(
        private readonly sessionRepository: ISessionRepository
    ) { }

    async handle(input: CloseSessionInput): Promise<CloseSessionOutput> {
        const existingSession = await this.sessionRepository.findByConnectionId(input.ConnectionId.trim());
        if (!existingSession) {
            throw new DomainError(`Session with ConnectionId ${input.ConnectionId.trim()} not found`);
        }

        const session = Session.fromDto(existingSession);
        session.close();

        const sessionDto = session.toDto();
        await this.sessionRepository.save(sessionDto);

        return sessionDto;
    }
}
