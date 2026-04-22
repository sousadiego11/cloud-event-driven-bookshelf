import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import type { IEventPublisher } from "../../application/Event/EventPublisher";
import type { Events } from "../../application/Event/Events";
import { Logger } from "../../shared/logger";

export class AWSEventBridgePublisher implements IEventPublisher {

    private constructor(
        private readonly eventBridgeClient: EventBridgeClient
    ) { }

    static async create() {
        const client = new EventBridgeClient({});
        return new AWSEventBridgePublisher(client);
    }


    async publish<E extends keyof Events.Mappings>(
        eventSource: Events.Source,
        eventName: E,
        payload: Events.Mappings[E]
    ): Promise<void> {

        const response = await this.eventBridgeClient.send(
            new PutEventsCommand({
                Entries: [
                    {
                        Detail: JSON.stringify(payload),
                        DetailType: eventName,
                        Resources: [],
                        Source: eventSource,
                    },
                ],
            }),
        );

        const failedCount = response.FailedEntryCount ?? 0;
        const entries = response.Entries ?? [];

        if (failedCount > 0) {
            Logger.error("EventBridge publish failed", {
                eventName,
                eventSource,
                failedCount,
                errors: entries
                    .filter(e => e.ErrorCode)
                    .map(e => ({
                        code: e.ErrorCode,
                        message: e.ErrorMessage,
                    })),
            });
            return;
        }

        Logger.log("EventBridge publish success", {
            eventName,
            eventSource,
            eventIds: entries.map(e => e.EventId),
        });
    }
}