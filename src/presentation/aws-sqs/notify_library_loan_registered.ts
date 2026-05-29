import type { SQSEvent } from "aws-lambda";
import type { LoanDTO } from "../../application/Loan/dtos/LoanDto";
import { NotifyLibraryLoanRegisteredUsecase } from "../../application/Notification/Usecase/NotifyLibraryLoanRegisteredUsecase";
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
            const notifyLibraryLoanRegisteredUsecase = new NotifyLibraryLoanRegisteredUsecase(notificationRepository);
            const notification = await notifyLibraryLoanRegisteredUsecase.handle(detail);

            Logger.log("Library notified about a new registered loan", {
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
