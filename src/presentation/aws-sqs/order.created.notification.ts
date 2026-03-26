import type { SQSEvent } from "aws-lambda";

export const handler = async (evt: SQSEvent) => {
    console.log(evt)
};