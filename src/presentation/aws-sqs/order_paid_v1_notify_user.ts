import type { SQSEvent } from "aws-lambda";
import { log } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    log("=======\n User notified for paid order: \n=======");
    log(JSON.stringify(evt))
};