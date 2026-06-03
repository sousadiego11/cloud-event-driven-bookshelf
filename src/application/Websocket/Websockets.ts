import type { NotificationDTO } from "../Notification/dtos/NotificationDto";

export namespace Websockets {
    export enum Names {
        NotificationCreated = "NotificationCreated"
    }

    export interface Mappings {
        [Names.NotificationCreated]: NotificationDTO;
    }
}