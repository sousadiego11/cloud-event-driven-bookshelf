import { Order } from "../../../domain/Order/Order";

export type OrderDTO = ReturnType<Order['toDto']>;

export interface IOrderRepository {
    // Create
    save(order: OrderDTO): Promise<void>;

    // Read (todas baseadas em UserId)
    findById(id: string): Promise<OrderDTO | null>;

    findByUserId(userId: string): Promise<OrderDTO[]>;

    findByUserIdOrderByCreatedAt(userId: string): Promise<OrderDTO[]>;

    findByUserIdOrderByUpdatedAt(userId: string): Promise<OrderDTO[]>;

    findByUserIdAndStatus(userId: string, status: string): Promise<OrderDTO[]>;

    findByIdAndUserId(orderId: string, userId: string): Promise<OrderDTO | null>;

    // Update
    update(order: OrderDTO): Promise<void>;

    // Delete
    delete(id: string): Promise<void>;
}