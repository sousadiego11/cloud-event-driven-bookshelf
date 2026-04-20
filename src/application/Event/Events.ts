import type { OrderDTO } from "../Order/dtos/OrderDto";

export namespace Events {
    export enum Source {
        Orders = "ecommerce.orders"
    }
    export enum Names {
        OrderCreated = "order.created",
        OrderCancelled = "order.cancelled",
        OrderPaid = "order.paid"
    }
    export interface Mappings {
        [Events.Names.OrderCreated]: OrderDTO;
        [Events.Names.OrderCancelled]: OrderDTO;
        [Events.Names.OrderPaid]: OrderDTO;
    }
}