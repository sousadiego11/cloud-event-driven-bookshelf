import type { SQSEvent } from "aws-lambda";
import type { LoanDTO } from "../../application/Loan/dtos/LoanDto";
import { AnalyzeBookDemandUsecase } from "../../application/Loan/Usecase/AnalyzeBookDemandUsecase";
import { NotificationService } from "../../application/Notification/services";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoNotificationRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-notifications-repository";
import { DynamoLoanRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-loans-repository";
import { DynamoInventoryRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-inventory-repository";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { LoanDTOSchema } from "../zod/LoanSchemas";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord<LoanDTO>(record, LoanDTOSchema);
            const notificationRepository = await DynamoNotificationRepository.create(dynamodbDocumentClient);
            const notificationService = new NotificationService(notificationRepository);
            const loanRepository = await DynamoLoanRepository.create(dynamodbDocumentClient);
            const inventoryRepository = await DynamoInventoryRepository.create(dynamodbDocumentClient);
            const analyzeDemandUsecase = new AnalyzeBookDemandUsecase(
                loanRepository,
                inventoryRepository,
                notificationService
            );

            const notification = await analyzeDemandUsecase.handle(detail);

            Logger.log("Demand analysis completed", {
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
