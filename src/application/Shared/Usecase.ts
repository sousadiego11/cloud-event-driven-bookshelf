export interface Usecase<I> {
    handle(input: I): Promise<void>;
}