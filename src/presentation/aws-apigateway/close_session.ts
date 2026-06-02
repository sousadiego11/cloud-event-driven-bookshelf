import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { CloseSessionUsecase } from "../../application/Session/Usecase/CloseSessionUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoSessionRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-sessions-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseContext } from "../../shared/parseContext";
import { SessionRequestContextSchema } from "../zod/SessionSchemas";

export const handler = async (evt: APIGatewayProxyWebsocketEventV2) => {
    try {
        Logger.log("Closing session");

        const sessionRepository = await DynamoSessionRepository.create(dynamodbDocumentClient);
        const closeSessionUsecase = new CloseSessionUsecase(sessionRepository);

        const context = parseContext(evt.requestContext, SessionRequestContextSchema);
        const result = await closeSessionUsecase.handle({ ConnectionId: context.connectionId });

        return ApiResponse.ok(result);
    } catch (error) {
        Logger.error("Closing session", error);
        return ApiResponse.error(error);
    }
};
