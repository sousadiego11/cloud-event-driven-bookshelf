import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

import type { LoanDTO } from "../../application/Loan/dtos/LoanDto";
import type { ILoanRepository } from "../../application/Loan/repositories";

export class DynamoLoanRepository implements ILoanRepository {
  private TABLE_NAME = "bookshelf-loans";

  private constructor(
    private readonly docClient: DynamoDBDocumentClient
  ) { }

  static async create(docClient: DynamoDBDocumentClient) {
    return new DynamoLoanRepository(docClient);
  }

  async save(loan: LoanDTO): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: loan
    }));
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { Id: id }
    }));
  }
}
