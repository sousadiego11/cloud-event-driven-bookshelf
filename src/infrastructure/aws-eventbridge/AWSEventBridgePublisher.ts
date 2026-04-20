import type { IEventPublisher } from "../../application/Event/EventPublisher";
import type { Events } from "../../application/Event/Events";

export class AWSEventBridgePublisher implements IEventPublisher {
    publish<E extends keyof Events.Mappings>(eventSource: Events.Source, eventName: E, payload: Events.Mappings[E]): Promise<void> {
        throw new Error("Method not implemented.");
    }
}