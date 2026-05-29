import type { SQSEvent } from "aws-lambda";
import type { BookDTO } from "../../application/Book/dtos/BookDto";
import { NotifyLibraryBookRegisteredUsecase } from "../../application/Notification/Usecase/NotifyLibraryBookRegisteredUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoNotificationRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-notifications-repository";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { BookDTOSchema } from "../zod/BookSchemas";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord<BookDTO>(record, BookDTOSchema);
            const notificationRepository = await DynamoNotificationRepository.create(dynamodbDocumentClient);
            const notifyLibraryBookRegisteredUsecase = new NotifyLibraryBookRegisteredUsecase(notificationRepository);
            const notification = await notifyLibraryBookRegisteredUsecase.handle(detail);

            Logger.log("Library notified about a new registered book", {
                Book: detail,
                Notification: notification,
                SourceEvent: detailType,
            });
        } catch (error) {
            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};
