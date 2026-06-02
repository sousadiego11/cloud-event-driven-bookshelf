export interface SessionDTO {
    Id: string;
    UserId: string;
    ConnectionId: string;
    Status: "active" | "closed";
    RegisteredAt: string;
    UpdatedAt: string;
}
