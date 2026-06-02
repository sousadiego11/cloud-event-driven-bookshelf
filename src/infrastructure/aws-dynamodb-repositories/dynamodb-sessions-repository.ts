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
            },
            Limit: 1
        }));

        return result.Items?.[0] as SessionDTO | undefined ?? null;
    }

    async findByUserId(userId: string): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_user_idx",
            KeyConditionExpression: "UserId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }));

        return result.Items?.map((item) => item as SessionDTO) ?? [];
    }

    async findByUserIdAndStatus(userId: string, status: SessionDTO["Status"]): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_user_status_idx",
            KeyConditionExpression: "UserId = :userId AND #status = :status",
            ExpressionAttributeNames: {
                "#status": "Status"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":status": status
            }
        }));

        return result.Items?.map((item) => item as SessionDTO) ?? [];
    }

    async findByUserIdRegisteredAfter(userId: string, registeredAt: string): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_user_registered_idx",
            KeyConditionExpression: "UserId = :userId AND RegisteredAt > :registeredAt",
            ExpressionAttributeValues: {
                ":userId": userId,
                ":registeredAt": registeredAt
            }
        }));

        return result.Items?.map((item) => item as SessionDTO) ?? [];
    }

    async findByUserIdUpdatedAfter(userId: string, updatedAt: string): Promise<SessionDTO[]> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: "bookshelf_session_user_updated_idx",
            KeyConditionExpression: "UserId = :userId AND UpdatedAt > :updatedAt",
            ExpressionAttributeValues: {
                ":userId": userId,
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
