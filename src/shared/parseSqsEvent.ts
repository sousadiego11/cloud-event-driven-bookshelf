import type { SQSRecord } from "aws-lambda";
import type { Events } from "../application/Event/Events";
import type { ZodType } from "zod";
import { parseBody } from "./parsebody";

export function parseSqsRecord<T>(record: SQSRecord, schema: ZodType<T>) {
    const body = JSON.parse(record.body);
    const detailType = body["detail-type"];
    const detail = parseBody(JSON.stringify(body.detail), schema);

    return {
        detailType: detailType as Events.Names,
        detail: detail as T
    }
}