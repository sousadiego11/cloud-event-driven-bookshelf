import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    Logger.log("=======\n Reserved inventory: \n=======");
    Logger.log(JSON.stringify(evt))
};