export interface EventHandler<T, E> {
    readonly handlesEvent: E;
    handle(event: T): Promise<void>;
}