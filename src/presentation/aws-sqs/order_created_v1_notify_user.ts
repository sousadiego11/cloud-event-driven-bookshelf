import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { OrderSchema } from "../aws-apigateway/create_order";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord(record, OrderSchema);
            Logger.log(`Notifying user for ${detailType}`, detail);

        } catch (error) {
            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};