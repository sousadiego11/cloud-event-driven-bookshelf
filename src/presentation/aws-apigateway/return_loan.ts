import type { APIGatewayProxyEvent } from "aws-lambda";
import type { ReturnLoanInput } from "../../application/Loan/Usecase/ReturnLoanUsecase";
import { ReturnLoanUsecase } from "../../application/Loan/Usecase/ReturnLoanUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoInventoryRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-inventory-repository";
import { DynamoLoanRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-loans-repository";
import { AWSEventBridgePublisher } from "../../infrastructure/aws-eventbridge/eventbridge-publisher";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseBody } from "../../shared/parsebody";
import { RegisterLoanSchema } from "../zod/LoanSchemas";

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Returning loan");

        const loanRepository = await DynamoLoanRepository.create(dynamodbDocumentClient);
        const inventoryRepository = await DynamoInventoryRepository.create(dynamodbDocumentClient);
        const publisher = await AWSEventBridgePublisher.create();
        const returnLoanUsecase = new ReturnLoanUsecase(loanRepository, inventoryRepository, publisher);

        const body = parseBody<ReturnLoanInput>(evt.body, RegisterLoanSchema);
        const result = await returnLoanUsecase.handle(body);

        return ApiResponse.ok(result);
    } catch (error) {
        Logger.error("Returning loan", error);
        return ApiResponse.error(error);
    }
};
