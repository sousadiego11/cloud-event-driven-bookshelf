import type { APIGatewayProxyEvent } from "aws-lambda";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoBookRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-books-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Listing all books");

        const bookRepository = await DynamoBookRepository.create(dynamodbDocumentClient);
        const books = await bookRepository.getAll();

        return ApiResponse.ok({ Books: books });
    } catch (error) {
        Logger.error("Listing books", error);
        return ApiResponse.error(error);
    }
};
