import type { SQSEvent } from "aws-lambda";
import type { BookDTO } from "../../application/Book/dtos/BookDto";
import { InitializeInventoryForBookUsecase } from "../../application/Inventory/Usecase/InitializeInventoryForBookUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoInventoryRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-inventory-repository";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { BookDTOSchema } from "../zod/BookSchemas";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord<BookDTO>(record, BookDTOSchema);
            const inventoryRepo = await DynamoInventoryRepository.create(dynamodbDocumentClient);
            const initializeInventoryForBookUsecase = new InitializeInventoryForBookUsecase(inventoryRepo);

            const inventory = await initializeInventoryForBookUsecase.handle(detail)

            Logger.log("Inventory initialized for a new registered book", {
                Book: detail,
                Inventory: inventory,
                SourceEvent: detailType,
            });
        } catch (error) {
            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};
