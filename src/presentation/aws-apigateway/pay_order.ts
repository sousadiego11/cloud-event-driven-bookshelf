import type { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    Logger.log("=======\nOrder paid: \n=======");

    return {
        statusCode: 200,
        body: JSON.stringify({}),
    };
};