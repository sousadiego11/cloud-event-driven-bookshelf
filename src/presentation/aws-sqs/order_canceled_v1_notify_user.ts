import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    Logger.log("=======\n User notified for canceled order: \n=======");
    Logger.log(JSON.stringify(evt))
};