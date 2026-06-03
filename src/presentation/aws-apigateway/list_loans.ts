import type { APIGatewayProxyEvent } from "aws-lambda";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoLoanRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-loans-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Listing all loans");

        const loanRepository = await DynamoLoanRepository.create(dynamodbDocumentClient);
        const loans = await loanRepository.getAll();

        return ApiResponse.ok({ Loans: loans });
    } catch (error) {
        Logger.error("Listing loans", error);
        return ApiResponse.error(error);
    }
};
