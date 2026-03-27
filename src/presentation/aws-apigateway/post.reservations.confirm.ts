import type { APIGatewayProxyEvent } from "aws-lambda";
import { log } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    log("reservation confirmed: ");

    return {
        statusCode: 200,
        body: JSON.stringify({}),
    };
};