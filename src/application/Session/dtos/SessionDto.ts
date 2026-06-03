export interface SessionDTO {
    Id: string;
    ConnectionId: string;
    SessionStatus: "active" | "closed";
    RegisteredAt: string;
    UpdatedAt: string;
}
