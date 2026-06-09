import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand
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

  async findByIsbn(isbn: string): Promise<BookDTO | null> {
    const result = await this.docClient.send(new QueryCommand({
      TableName: this.TABLE_NAME,
      IndexName: "bookshelf_isbn_idx",
      KeyConditionExpression: "Isbn = :isbn",
      ExpressionAttributeValues: {
        ":isbn": isbn
      }

    }));

    return result.Items?.[0] as BookDTO | undefined ?? null;
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { Id: id }
    }));
  }

  async getAll(): Promise<BookDTO[]> {
    const result = await this.docClient.send(new ScanCommand({
      TableName: this.TABLE_NAME
    }));

    return (result.Items as BookDTO[]) || [];
  }
}
