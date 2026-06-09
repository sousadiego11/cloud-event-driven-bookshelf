import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

import type { InventoryDTO } from "../../application/Inventory/dtos/InventoryDto";
import type { IInventoryRepository } from "../../application/Inventory/repositories";

export class DynamoInventoryRepository implements IInventoryRepository {
  private TABLE_NAME = "bookshelf-inventory";

  private constructor(
    private readonly docClient: DynamoDBDocumentClient
  ) { }

  static async create(docClient: DynamoDBDocumentClient) {
    return new DynamoInventoryRepository(docClient);
  }

  async save(inventory: InventoryDTO): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: inventory
    }));
  }

  async findByBookId(bookId: string): Promise<InventoryDTO | null> {
    const result = await this.docClient.send(new QueryCommand({
      TableName: this.TABLE_NAME,
      IndexName: "bookshelf_inventory_book_idx",
      KeyConditionExpression: "BookId = :bookId",
      ExpressionAttributeValues: {
        ":bookId": bookId
      }
    }));

    return result.Items?.[0] as InventoryDTO | undefined ?? null;
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { Id: id }
    }));
  }
}
