import type { SQSEvent } from "aws-lambda";
import type { BookDTO } from "../../application/Book/dtos/BookDto";
import { Logger } from "../../shared/logger";
import { parseSqsRecord } from "../../shared/parseSqsEvent";
import { BookDTOSchema } from "../zod/BookSchemas";

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            const { detail, detailType } = parseSqsRecord<BookDTO>(record, BookDTOSchema);

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
