import type { SQSEvent } from "aws-lambda";
import { log } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    log("=======\n User notified: \n=======");
    log(JSON.stringify(evt))
};