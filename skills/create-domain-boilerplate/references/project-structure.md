# Project Structure Reference

Current domain/application layout:

```text
src/domain/
  Error/errors.ts
  Inventory/Inventory.ts
  Notification/Notification.ts
  Order/Order.ts

src/application/
  Event/EventPublisher.ts
  Event/Events.ts
  Inventory/repositories/IInventoryRepository.ts
  Inventory/repositories/index.ts
  Notification/repositories/INotificationRepository.ts
  Notification/repositories/index.ts
  Notification/Usecase/SendOrderCreatedNotificationUsecase.ts
  Order/dtos/OrderDto.ts
  Order/repositories/IOrderRepository.ts
  Order/repositories/index.ts
  Order/Usecase/CreateOrderUsecase.ts
  Payment/repositories/IPaymentRepository.ts
  Payment/repositories/index.ts
  Shipment/repositories/IShipmentRepository.ts
  Shipment/repositories/index.ts
  Shared/Id.ts
  Shared/Usecase.ts
```

Observed conventions:

- Domain folder and domain class use PascalCase: `Order/Order.ts`, `Notification/Notification.ts`.
- Application folder uses the same domain name: `src/application/Order`, `src/application/Notification`.
- Use case folder is named `Usecase`, and use case classes end in `Usecase`.
- Repository folder is named `repositories`.
- Repository interfaces use `I<Domain>Repository`.
- Repository barrels export the interface type from `index.ts`.
- `OrderDTO` lives under `src/application/Order/dtos/OrderDto.ts` because it is also an event/API contract.
- `NotificationDTO` belongs in `src/application/Notification/repositories/INotificationRepository.ts` because it is repository/application contract, not domain code.
- DTO keys used by persistence/event contracts are PascalCase.
- Domain fields should be camelCase and should not use underscore-prefixed backing fields.
- Domain-local type aliases should live inside exported namespaces such as `OrderDomain`, `InventoryDomain`, and `NotificationDomain`.

When creating a new module, inspect whether partial folders already exist. In this repo, some application repository interfaces may exist before the matching domain class or infrastructure implementation.
