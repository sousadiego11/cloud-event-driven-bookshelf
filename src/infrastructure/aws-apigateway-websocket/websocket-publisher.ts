import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";
import type { ISessionRepository } from "../../application/Session/repositories";
import type { IWebSocketPublisher } from "../../application/Websocket/IWebsocketPublisher";
import type { Websockets } from "../../application/Websocket/Websockets";

export class AwsWebSocketPublisher implements IWebSocketPublisher {
    private readonly client: ApiGatewayManagementApiClient;

    private constructor(
        endpoint: string,
        private readonly sessionRepository: ISessionRepository
    ) {
        this.client = new ApiGatewayManagementApiClient({
            endpoint
        });
    }

    static async create(
        sessionRepository: ISessionRepository
    ): Promise<AwsWebSocketPublisher> {
        const endpoint = process.env.WEBSOCKET_URL;

        if (!endpoint) {
            throw new Error("WEBSOCKET_URL environment variable is not set");
        }

        return new AwsWebSocketPublisher(
            endpoint,
            sessionRepository
        );
    }

    async publish<E extends keyof Websockets.Mappings>(
        name: E,
        payload: Websockets.Mappings[E]
    ): Promise<void> {
        const sessions = await this.sessionRepository.findByStatus("active");

        const message = new TextEncoder().encode(
            JSON.stringify({
                name,
                payload
            })
        );

        await Promise.all(
            sessions.map(async session => {
                await this.client.send(
                    new PostToConnectionCommand({
                        ConnectionId: session.ConnectionId,
                        Data: message
                    })
                );
            })
        );
    }
}