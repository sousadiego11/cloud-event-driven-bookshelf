import type { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import { CreateOrderUsecase } from "../../application/Order/Usecase/CreateOrderUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb-client";
import { DynamoOrderRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-orders-repository";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { Logger } from "../../shared/logger";
import { parseBody } from "../../shared/parsebody";
import { AWSEventBridgePublisher } from "../../infrastructure/aws-eventbridge/eventbridge-publisher";

export const OrderItemSchema = z.object({
    ProductId: z.string().min(1),
    Quantity: z.number().int().positive(),
});

export const OrderSchema = z.object({
    Id: z.string().min(1),
    UserId: z.string().min(1),
    Items: z.array(OrderItemSchema).min(1),
    Status: z.enum(["created", "paid", "canceled", "shipped"]),
    CreatedAt: z.iso.datetime(),
    UpdatedAt: z.iso.datetime(),
});

export const handler = async (evt: APIGatewayProxyEvent) => {
    try {
        Logger.log("Creating order");

        const orderRepository = await DynamoOrderRepository.create(dynamodbDocumentClient)
        const publisher = await AWSEventBridgePublisher.create()
        const createOrderUsecase = new CreateOrderUsecase(orderRepository, publisher);

        const body = parseBody(evt.body, OrderSchema);
        const result = await createOrderUsecase.handle(body);

        return ApiResponse.created(result);
    } catch (error) {
        Logger.error("Creating order", error);
        return ApiResponse.error(error);
    }
};