import { Payment } from "../../../domain/Payment/Payment";

export type PaymentDTO = ReturnType<Payment['toDto']>;

export interface IPaymentRepository {
    // Create/Save operations
    save(paymentDto: PaymentDTO): Promise<void>;

    // Read operations
    findById(id: string): Promise<PaymentDTO | null>;
    findByOrderId(orderId: string): Promise<PaymentDTO | null>;
    findByStatus(status: string): Promise<PaymentDTO[]>;

    // Update operations
    update(paymentDto: PaymentDTO): Promise<void>;

    // Delete operations
    delete(id: string): Promise<void>;
}
