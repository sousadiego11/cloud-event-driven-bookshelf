import type { APIGatewayProxyEvent } from "aws-lambda";
import { CreateOrderUsecase } from "../../application/Order/Usecase/CreateOrderUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb_client";
import { DynamoOrderRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-orders-repository";
import { log } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        log("=======Creating order: =======");
        const orderRepository = await DynamoOrderRepository.create(dynamodbDocumentClient)
        const createOrderUsecase = new CreateOrderUsecase(orderRepository);

        const body = evt.body ? JSON.parse(evt.body) : {};
        await createOrderUsecase.handle({ UserId: body.UserId, Items: body.Items })
        log("=======Order created: =======");

        return {
            statusCode: 201,
            body: JSON.stringify({}),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};