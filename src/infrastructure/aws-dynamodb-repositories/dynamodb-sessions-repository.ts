import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";

import type { SessionDTO } from "../../application/Session/dtos/SessionDto";
import type { ISessionRepository } from "../../application/Session/repositories";

export class DynamoSessionRepository implements ISessionRepository {
    private TABLE_NAME = "bookshelf-sessions";

    private constructor(
        private readonly docClient: DynamoDBDocumentClient
    ) { }

    static async create(docClient: DynamoDBDocumentClient) {
        return new DynamoSessionRepository(docClient);
    }

    async save(sessionDto: SessionDTO): Promise<void> {
        await this.docClient.send(new PutCommand({
            TableName: this.TABLE_NAME,
            Item: sessionDto
        }));
    }

    async findByConnectionId(connectionId: string): Promise<SessionDTO | null> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_connection_idx",
            KeyConditionExpression: "ConnectionId = :connectionId",
            ExpressionAttributeValues: {
                ":connectionId": connectionId
            }
        }));

        return result.Items?.[0] as SessionDTO | undefined ?? null;
    }

    async findByStatus(status: SessionDTO["SessionStatus"]): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_status_idx",
            KeyConditionExpression: "SessionStatus = :status",
            ExpressionAttributeValues: {
                ":status": status
            }
        }));

        return result.Items?.map(item => item as SessionDTO) ?? [];
    }

    async findByRegisteredAt(registeredAt: string): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_registered_at_idx",
            KeyConditionExpression: "RegisteredAt = :registeredAt",
            ExpressionAttributeValues: {
                ":registeredAt": registeredAt
            }
        }));

        return result.Items?.map((item) => item as SessionDTO) ?? [];
    }

    async findByUpdatedAt(updatedAt: string): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_updated_at_idx",
            KeyConditionExpression: "UpdatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":updatedAt": updatedAt
            }
        }));

        return result.Items?.map((item) => item as SessionDTO) ?? [];
    }

    async delete(id: string): Promise<void> {
        await this.docClient.send(new DeleteCommand({
            TableName: this.TABLE_NAME,
            Key: { Id: id }
        }));
    }
}
