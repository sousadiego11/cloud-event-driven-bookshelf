import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";
import type { ISessionRepository } from "../../application/Session/repositories";
import type { IWebSocketPublisher } from "../../application/Websocket/IWebsocketPublisher";
import type { Websockets } from "../../application/Websocket/Websockets";
import { Logger } from "../../shared/logger";

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

        Logger.log("WebSocketPublisher initialized", {
            endpoint
        });

        return new AwsWebSocketPublisher(
            endpoint,
            sessionRepository
        );
    }

    async publish<E extends keyof Websockets.Mappings>(
        name: E,
        payload: Websockets.Mappings[E]
    ): Promise<void> {

        Logger.log("WebSocket publish started", {
            eventName: name,
        });

        const sessions = await this.sessionRepository.findByStatus("active");

        Logger.log("WebSocket sessions fetched", {
            count: sessions.length,
            status: "active"
        });

        const message = new TextEncoder().encode(
            JSON.stringify({
                name,
                payload
            })
        );

        const results = await Promise.allSettled(
            sessions.map(async session => {
                try {
                    await this.client.send(
                        new PostToConnectionCommand({
                            ConnectionId: session.ConnectionId,
                            Data: message
                        })
                    );

                    return {
                        connectionId: session.ConnectionId,
                        status: "sent"
                    };
                } catch (err) {
                    Logger.error("WebSocket send failed", {
                        connectionId: session.ConnectionId,
                        error: err
                    });

                    return {
                        connectionId: session.ConnectionId,
                        status: "failed",
                        error: err
                    };
                }
            })
        );

        const succeeded = results.filter(r =>
            r.status === "fulfilled" && r.value.status === "sent"
        ).length;

        const failed = results.length - succeeded;

        if (failed > 0) {
            Logger.error("WebSocket publish partially failed", {
                eventName: name,
                total: results.length,
                succeeded,
                failed
            });
            return;
        }

        Logger.log("WebSocket publish success", {
            eventName: name,
            total: results.length
        });
    }
}