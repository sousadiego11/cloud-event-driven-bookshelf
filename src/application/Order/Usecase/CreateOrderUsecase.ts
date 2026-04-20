import { Order } from "../../../domain/Order/Order";
import type { Usecase } from "../../Shared/Usecase";
import type { OrderDTO } from "../dtos/OrderDto";
import type { IOrderRepository } from "../repositories/IOrderRepository";

type CreateOrderInput = Pick<OrderDTO, "UserId" | "Items">;

export class CreateOrderUsecase implements Usecase<CreateOrderInput, OrderDTO> {
    constructor(
        private readonly orderRepository: IOrderRepository
    ) { }

    async handle(input: CreateOrderInput): Promise<OrderDTO> {
        const order = Order.createFromDto(input.UserId, input.Items);
        await this.orderRepository.save(order.toDto());
        return order.toDto();
    }
}