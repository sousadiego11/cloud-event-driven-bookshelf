import type { SQSEvent } from "aws-lambda";
import { log } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    log("=======\n Warehouse notified: \n=======");
    log(JSON.stringify(evt))
};