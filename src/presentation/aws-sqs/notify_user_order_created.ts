import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { OrderSchema } from "../aws-apigateway/create_order";
import { DynamoNotificationRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-notifications-repository";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { SendOrderCreatedNotificationUsecase } from "../../application/Notification/Usecase/SendOrderCreatedNotificationUsecase";
import { NotificationAlreadySentError } from "../../domain/Error/errors";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord(record, OrderSchema);

            const notificationsRepository = await DynamoNotificationRepository.create(dynamodbDocumentClient);
            const notifyOrderToUserUsecase = new SendOrderCreatedNotificationUsecase(notificationsRepository);
            const notification = await notifyOrderToUserUsecase.handle(detail);

            Logger.log(`Notification sent to user. Notification ID: ${notification.Id}, Order ID: ${detail.Id}, Source Event: ${detailType}`);

        } catch (error) {
            if (error instanceof NotificationAlreadySentError) {
                Logger.error(error.message, error);
                continue;
            }

            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};
