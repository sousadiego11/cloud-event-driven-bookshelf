import { Order } from "../../../domain/Order/Order";

export type OrderDTO = ReturnType<Order['toDto']>;

export interface IOrderRepository {
    // Create/Save operations
    save(orderDto: OrderDTO): Promise<void>;

    // Read operations
    findById(id: string): Promise<OrderDTO | null>;
    findByUserId(userId: string): Promise<OrderDTO[]>;
    findByStatus(status: string): Promise<OrderDTO[]>;
    findByIdAndUserId(orderId: string, userId: string): Promise<OrderDTO | null>;

    // Update operations
    update(orderDto: OrderDTO): Promise<void>;

    // Delete operations
    delete(id: string): Promise<void>;
}
