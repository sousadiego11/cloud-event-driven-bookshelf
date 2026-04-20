import { Order } from "../../../domain/Order/Order";
import type { Usecase } from "../../Shared/Usecase";
import type { IOrderRepository, OrderDTO } from "../repositories/IOrderRepository";

type Input = Pick<OrderDTO, "UserId" | "Items">;

export class CreateOrderUsecase implements Usecase<Input> {
    constructor(
        private readonly orderRepository: IOrderRepository
    ) { }

    async handle(input: Input): Promise<void> {
        const order = Order.create(input.UserId, input.Items);
        await this.orderRepository.save(order.toDto());
    }
}