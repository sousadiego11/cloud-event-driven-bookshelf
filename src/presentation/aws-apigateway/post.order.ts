import type { APIGatewayProxyEvent } from "aws-lambda";
import { Order } from "../../domain/Order/Order";
import { log } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    const order = Order.make("1", 100);

    log("Order created: " + JSON.stringify(order.toDTO()));

    return {
        statusCode: 200,
        body: JSON.stringify(order.toDTO()),
    };
};