import type { SQSEvent } from "aws-lambda";
import type { LoanDTO } from "../../application/Loan/dtos/LoanDto";
import { NotifyLibraryLoanReturnedUsecase } from "../../application/Notification/Usecase/NotifyLibraryLoanReturnedUsecase";
import { NotificationService } from "../../application/Notification/services";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoNotificationRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-notifications-repository";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { LoanDTOSchema } from "../zod/LoanSchemas";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord<LoanDTO>(record, LoanDTOSchema);
            const notificationRepository = await DynamoNotificationRepository.create(dynamodbDocumentClient);
            const notificationService = new NotificationService(notificationRepository);
            const notifyLibraryLoanReturnedUsecase = new NotifyLibraryLoanReturnedUsecase(notificationService);
            const notification = await notifyLibraryLoanReturnedUsecase.handle(detail);

            Logger.log("Library notified about a returned loan", {
                Loan: detail,
                Notification: notification,
                SourceEvent: detailType,
            });
        } catch (error) {
            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};
