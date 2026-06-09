import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

import type { NotificationDTO } from "../../application/Notification/dtos/NotificationDto";
import type { INotificationRepository } from "../../application/Notification/repositories";

export class DynamoNotificationRepository implements INotificationRepository {
  private TABLE_NAME = "bookshelf-notifications";

  private constructor(
    private readonly docClient: DynamoDBDocumentClient
  ) { }

  static async create(docClient: DynamoDBDocumentClient) {
    return new DynamoNotificationRepository(docClient);
  }

  async save(notificationDto: NotificationDTO): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: notificationDto
    }));
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<NotificationDTO | null> {
    const result = await this.docClient.send(new QueryCommand({
      TableName: this.TABLE_NAME,
      IndexName: "bookshelf_notification_idempotency_key_idx",
      KeyConditionExpression: "IdempotencyKey = :idempotencyKey",
      ExpressionAttributeValues: {
        ":idempotencyKey": idempotencyKey
      }
    }));

    return result.Items?.[0] as NotificationDTO | undefined ?? null;
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { Id: id }
    }));
  }
}
