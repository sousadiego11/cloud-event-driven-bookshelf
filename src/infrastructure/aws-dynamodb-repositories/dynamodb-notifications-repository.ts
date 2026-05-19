import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

import type { INotificationRepository } from "../../application/Notification/repositories";
import type { NotificationDTO } from "../../application/Notification/repositories/INotificationRepository";

export class DynamoNotificationRepository implements INotificationRepository {
  private TABLE_NAME = "cede-notifications";

  private constructor(
    private readonly docClient: DynamoDBDocumentClient
  ) { }

  static async create(docClient: DynamoDBDocumentClient) {
    return new DynamoNotificationRepository(docClient);
  }

  async findById(id: NotificationDTO['Id']): Promise<NotificationDTO> {
    const resp = await this.docClient.send(
      new GetCommand({
        TableName: this.TABLE_NAME,
        Key: {
          Id: id
        }
      })
    );

    return resp.Item as NotificationDTO;
  }

  async save(notification: NotificationDTO): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: notification
    }));
  }

  async delete(id: NotificationDTO['Id']): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { Id: id }
    }));
  }
}