import type { APIGatewayProxyEvent } from "aws-lambda";
import { log } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    log("reservation canceled: ");

    return {
        statusCode: 200,
        body: JSON.stringify({}),
    };
};