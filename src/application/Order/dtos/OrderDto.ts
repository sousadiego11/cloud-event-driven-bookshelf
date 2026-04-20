
export interface OrderItemDTO {
    ProductId: string;
    Quantity: number;
}

export interface OrderDTO {
    Id: string;
    UserId: string;
    Items: OrderItemDTO[];
    Status: "created" | "paid" | "canceled" | "shipped";
    CreatedAt: string;  // ISO string
    UpdatedAt: string;  // ISO string
}