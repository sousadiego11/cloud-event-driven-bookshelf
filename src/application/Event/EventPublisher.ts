import type { Events } from "./Events";

export interface IEventPublisher {
    publish<E extends keyof Events.Mappings>(
        eventSource: Events.Source,
        eventName: E,
        payload: Events.Mappings[E]
    ): Promise<void>;
}