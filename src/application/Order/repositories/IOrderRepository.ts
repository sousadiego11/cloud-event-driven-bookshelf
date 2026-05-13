import type { OrderDTO } from "../dtos/OrderDto";

export interface IOrderRepository {
    save(order: OrderDTO): Promise<void>;

    delete(id: string): Promise<void>;
}