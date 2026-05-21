import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

import type { BookDTO } from "../../application/Book/dtos/BookDto";
import type { IBookRepository } from "../../application/Book/repositories";

export class DynamoBookRepository implements IBookRepository {
  private TABLE_NAME = "bookshelf-books";

  private constructor(
    private readonly docClient: DynamoDBDocumentClient
  ) { }

  static async create(docClient: DynamoDBDocumentClient) {
    return new DynamoBookRepository(docClient);
  }

  async save(book: BookDTO): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: book
    }));
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { Id: id }
    }));
  }
}
