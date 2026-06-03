import type { Websockets } from "./Websockets";

export interface IWebSocketPublisher {
    publish<E extends keyof Websockets.Mappings>(
        notificationName: E,
        payload: Websockets.Mappings[E]
    ): Promise<void>;
}