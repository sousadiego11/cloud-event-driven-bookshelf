import type { SQSEvent } from "aws-lambda";
import { log } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    log("=======\n Released inventory: \n=======");
    log(JSON.stringify(evt))
};