import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";
import { parseBody } from "../aws-apigateway/util/parsebody";
import { OrderSchema } from "../aws-apigateway/create_order";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const detailType = body["detail-type"];
            const detail = parseBody(JSON.stringify(body.detail), OrderSchema);

            Logger.log(`Notifying user for ${detailType}`, detail);

        } catch (error) {
            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};