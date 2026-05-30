import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
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

  async findByBookForCpf(bookId: string, cpf: string): Promise<LoanDTO | null> {
    const result = await this.docClient.send(new QueryCommand({
      TableName: this.TABLE_NAME,
      IndexName: "bookshelf_book_by_cpf_idx",
      KeyConditionExpression: "Cpf = :cpf AND BookId = :bookId",
      ExpressionAttributeValues: {
        ":cpf": cpf,
        ":bookId": bookId
      },
      Limit: 1
    }));

    return result.Items?.[0] as LoanDTO | undefined ?? null;
  }

  async findByBookIdInPeriod(bookId: string, days: number): Promise<LoanDTO[]> {
    const now = new Date();
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const pastDateIso = pastDate.toISOString();

    const result = await this.docClient.send(new QueryCommand({
      TableName: this.TABLE_NAME,
      IndexName: "bookshelf_book_registered_idx",
      KeyConditionExpression: "BookId = :bookId AND RegisteredAt >= :pastDate",
      ExpressionAttributeValues: {
        ":bookId": bookId,
        ":pastDate": pastDateIso
      }
    }));

    return (result.Items as LoanDTO[]) || [];
  }
}
