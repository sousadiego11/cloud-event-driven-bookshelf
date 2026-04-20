export interface Usecase<I, O> {
    handle(input: I): Promise<O>;
}