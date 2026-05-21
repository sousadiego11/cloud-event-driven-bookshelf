import type { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import { RegisterBookUsecase } from "../../application/Book/Usecase/RegisterBookUsecase";
import { AWSEventBridgePublisher } from "../../infrastructure/aws-eventbridge/eventbridge-publisher";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoBookRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-books-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseBody } from "../../shared/parsebody";

export const RegisterBookSchema = z.object({
    Title: z.string().min(1),
    Author: z.string().min(1),
    Isbn: z.string().min(1).optional(),
});

export const BookRegisteredSchema = RegisterBookSchema.extend({
    Id: z.string().min(1),
    RegisteredAt: z.iso.datetime(),
    UpdatedAt: z.iso.datetime(),
});

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Registering book");

        const bookRepository = await DynamoBookRepository.create(dynamodbDocumentClient);
        const publisher = await AWSEventBridgePublisher.create();
        const registerBookUsecase = new RegisterBookUsecase(bookRepository, publisher);

        const body = parseBody(evt.body, RegisterBookSchema);
        const result = await registerBookUsecase.handle(body);

        return ApiResponse.created(result);
    } catch (error) {
        Logger.error("Registering book", error);
        return ApiResponse.error(error);
    }
};
