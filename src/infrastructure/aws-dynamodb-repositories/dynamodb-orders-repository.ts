import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

import type { IOrderRepository } from "../../application/Order/repositories";
import type { OrderDTO } from "../../application/Order/dtos/OrderDto";


export class DynamoOrderRepository implements IOrderRepository {
  private TABLE_NAME = "cede-orders";

  private constructor(
    private readonly docClient: DynamoDBDocumentClient
  ) { }

  static async create(docClient: DynamoDBDocumentClient) {
    return new DynamoOrderRepository(docClient);
  }

  findById(id: string): Promise<OrderDTO | null> {
    throw new Error("Method not implemented.");
  }
  findByUserId(userId: string): Promise<OrderDTO[]> {
    throw new Error("Method not implemented.");
  }
  findByUserIdOrderByCreatedAt(userId: string): Promise<OrderDTO[]> {
    throw new Error("Method not implemented.");
  }
  findByUserIdOrderByUpdatedAt(userId: string): Promise<OrderDTO[]> {
    throw new Error("Method not implemented.");
  }
  findByUserIdAndStatus(userId: string, status: string): Promise<OrderDTO[]> {
    throw new Error("Method not implemented.");
  }
  findByIdAndUserId(orderId: string, userId: string): Promise<OrderDTO | null> {
    throw new Error("Method not implemented.");
  }

  async save(order: OrderDTO): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: order
    }));
  }

  async update(order: OrderDTO): Promise<void> {
    await this.save(order);
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { id }
    }));
  }
}