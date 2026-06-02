export interface SessionDTO {
    Id: string;
    ConnectionId: string;
    Status: "active" | "closed";
    RegisteredAt: string;
    UpdatedAt: string;
}
