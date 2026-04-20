import type { APIGatewayProxyEvent } from "aws-lambda";
import { CreateOrderUsecase } from "../../application/Order/Usecase/CreateOrderUsecase";
import { dynamodbDocumentClient } from "../../infrastructure/aws-dynamodb-client/dynamodb_client";
import { DynamoOrderRepository } from "../../infrastructure/aws-dynamodb-repositories/dynamodb-orders-repository";
import { log } from "../../shared/logger";
import { ApiResponse } from "../../infrastructure/http/ApiResponse";
import { z } from "zod";
import { parseBody } from "./util/parsebody";

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
        log("Creating order");

        const orderRepository = await DynamoOrderRepository.create(dynamodbDocumentClient)
        const createOrderUsecase = new CreateOrderUsecase(orderRepository);

        const body = parseBody(evt.body, OrderSchema);
        const result = await createOrderUsecase.handle(body);

        return ApiResponse.created(result);

    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal server error");
    }
};