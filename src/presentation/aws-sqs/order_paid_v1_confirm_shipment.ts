import type { SQSEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";

export const handler = async (evt: SQSEvent) => {
    Logger.log("=======\n Shipment confirmed: \n=======");
    Logger.log(JSON.stringify(evt))
};