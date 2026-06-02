import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { RegisterSessionUsecase } from "../../application/Session/Usecase/RegisterSessionUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoSessionRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-sessions-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseContext } from "../../shared/parseContext";
import { SessionRequestContextSchema } from "../zod/SessionSchemas";

export const handler = async (evt: APIGatewayProxyWebsocketEventV2) => {
    try {
        Logger.log("Registering session");

        const sessionRepository = await DynamoSessionRepository.create(dynamodbDocumentClient);
        const registerSessionUsecase = new RegisterSessionUsecase(sessionRepository);

        const context = parseContext(evt.requestContext, SessionRequestContextSchema);
        const result = await registerSessionUsecase.handle({ ConnectionId: context.connectionId });

        return ApiResponse.created(result);
    } catch (error) {
        Logger.error("Registering session", error);
        return ApiResponse.error(error);
    }
};
