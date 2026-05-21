import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { BookRegisteredSchema } from "../aws-apigateway/register_book";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord(record, BookRegisteredSchema);

            Logger.log("Library notified about a new registered book", {
                BookId: detail.Id,
                Title: detail.Title,
                Author: detail.Author,
                SourceEvent: detailType,
            });
        } catch (error) {
            Logger.error("Error processing SQS message", error);
            throw error;
        }
    }
};
