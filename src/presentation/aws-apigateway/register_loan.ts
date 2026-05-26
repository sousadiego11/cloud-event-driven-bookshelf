import type { APIGatewayProxyEvent } from "aws-lambda";
import { RegisterLoanUsecase } from "../../application/Loan/Usecase/RegisterLoanUsecase";
import type { RegisterLoanInput } from "../../application/Loan/Usecase/RegisterLoanUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoLoanRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-loans-repository";
import { AWSEventBridgePublisher } from "../../infrastructure/aws-eventbridge/eventbridge-publisher";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseBody } from "../../shared/parsebody";
import { RegisterLoanSchema } from "../zod/LoanSchemas";

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Registering loan");

        const loanRepository = await DynamoLoanRepository.create(dynamodbDocumentClient);
        const publisher = await AWSEventBridgePublisher.create();
        const registerLoanUsecase = new RegisterLoanUsecase(loanRepository, publisher);

        const body = parseBody<RegisterLoanInput>(evt.body, RegisterLoanSchema);
        const result = await registerLoanUsecase.handle(body);

        return ApiResponse.created(result);
    } catch (error) {
        Logger.error("Registering loan", error);
        return ApiResponse.error(error);
    }
};
