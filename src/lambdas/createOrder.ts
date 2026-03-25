import { Order } from "../core/Order/Order";
import { log } from "../shared/logger";

export const handler = async () => {
    const order = Order.make("1", 100);

    log("Order created: " + JSON.stringify(order.toDTO()));

    return {
        statusCode: 200,
        body: JSON.stringify(order.toDTO()),
    };
};