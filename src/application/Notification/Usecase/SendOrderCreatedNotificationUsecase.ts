
import { DomainError, NotificationAlreadySentError } from "../../../domain/Error/errors";
import { NotificationFactory } from "../../../domain/Notification/Notification";
import type { OrderDTO } from "../../Order/dtos/OrderDto";
import type { Usecase } from "../../Shared/Usecase";
import type { INotificationRepository } from "../repositories";
import type { NotificationDTO } from "../repositories/INotificationRepository";

export class SendOrderCreatedNotificationUsecase implements Usecase<OrderDTO, NotificationDTO> {
    constructor(
        private readonly notificationRepository: INotificationRepository
    ) { }

    async handle(orderDto: OrderDTO): Promise<NotificationDTO> {
        const notification = NotificationFactory.forOrderCreated(orderDto);

        const notificationAlreadySent = await this.notificationRepository.findById(notification.id)
        if (notificationAlreadySent) throw new NotificationAlreadySentError(orderDto.Id);

        await this.notificationRepository.save(notification.toDto());

        return notification.toDto();
    }
}