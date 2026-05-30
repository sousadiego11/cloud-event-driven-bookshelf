import type { APIGatewayProxyEvent } from "aws-lambda";
import { RegisterBookUsecase } from "../../application/Book/Usecase/RegisterBookUsecase";
import type { RegisterBookInput } from "../../application/Book/Usecase/RegisterBookUsecase";
import { AWSEventBridgePublisher } from "../../infrastructure/aws-eventbridge/eventbridge-publisher";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoBookRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-books-repository";
import { DynamoInventoryRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-inventory-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseBody } from "../../shared/parsebody";
import { RegisterBookSchema } from "../zod/BookSchemas";

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Registering book");

        const bookRepository = await DynamoBookRepository.create(dynamodbDocumentClient);
        const inventoryRepository = await DynamoInventoryRepository.create(dynamodbDocumentClient);

        const publisher = await AWSEventBridgePublisher.create();
        const registerBookUsecase = new RegisterBookUsecase(bookRepository, inventoryRepository, publisher);

        const body = parseBody<RegisterBookInput>(evt.body, RegisterBookSchema);
        const result = await registerBookUsecase.handle(body);

        return ApiResponse.created(result);
    } catch (error) {
        Logger.error("Registering book", error);
        return ApiResponse.error(error);
    }
};
