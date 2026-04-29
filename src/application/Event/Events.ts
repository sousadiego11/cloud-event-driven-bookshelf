import type { OrderDTO } from "../Order/dtos/OrderDto";

export namespace Events {
    export enum Source {
        Orders = "cede.orders"
    }

    export enum Names {
        OrderCreated = "OrderCreated.v1",
        OrderCancelled = "OrderCancelled.v1",
        OrderPaid = "OrderPaid.v1"
    }

    export enum Queues {
        NotifyUser = "notification-user-order",
        NotifyWarehouse = "warehouse-order-processing",
        ReserveInventory = "inventory-reservation"
    }

    export interface Mappings {
        [Events.Names.OrderCreated]: OrderDTO;
        [Events.Names.OrderCancelled]: OrderDTO;
        [Events.Names.OrderPaid]: OrderDTO;
    }
}