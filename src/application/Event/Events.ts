import type { OrderDTO } from "../Order/dtos/OrderDto";

export namespace Events {
    export enum Source {
        Orders = "cede.orders"
    }

    export enum Names {
        OrderCreated = "CEDEOrderCreated.v1",
        OrderCancelled = "CEDEOrderCancelled.v1",
        OrderPaid = "CEDEOrderPaid.v1"
    }

    export enum Queues {
        NotifyUserOrderCreated = "cede-notification-user-order-created",
        NotifyWarehouseOrderCreated = "cede-notification-warehouse-order-created",
        ReserveInventory = "cede-inventory-reservation"
    }

    export interface Mappings {
        [Events.Names.OrderCreated]: OrderDTO;
        [Events.Names.OrderCancelled]: OrderDTO;
        [Events.Names.OrderPaid]: OrderDTO;
    }
}