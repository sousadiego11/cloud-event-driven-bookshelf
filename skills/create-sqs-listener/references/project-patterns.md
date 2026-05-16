# Project patterns

Use this file to rebuild context before creating or modifying an SQS listener in this repository.

## Source of truth

- `src/application/Event/Events.ts`
  - `Events.Names` defines event names used by EventBridge.
  - `Events.Queues` defines queue names used by SQS consumers.
  - `Events.Mappings` binds each event name to its DTO.

Keep names synchronized with Terraform and handler files.

## Current listener example

The current SQS listener is `notify_user_order_created`.

Relevant files:

- `src/presentation/aws-sqs/notify_user_order_created.ts`
- `src/application/Notification/Usecase/SendOrderCreatedNotificationUsecase.ts`
- `src/infrastructure/aws-dynamodb-repositories/dynamodb-notifications-repository.ts`
- `terraform/aws_sqs.tf`
- `terraform/aws_eventbridge.tf`
- `terraform/aws_lambdas.tf`
- `terraform/aws_dynamodb.tf`

Current flow:

1. EventBridge rule matches the application event.
2. EventBridge target sends the event to the SQS queue.
3. Lambda receives an SQS event.
4. Handler parses each record with `parseSqsRecord`.
5. The message body contains an EventBridge envelope with `detail-type` and `detail`.
6. The handler validates `detail` with a Zod schema.
7. The handler creates a Dynamo repository.
8. The handler invokes the use case.
9. The use case enforces domain rules and persists data.

## DTO and schema rule

Always confirm whether the DTO or schema must change before editing any contract file.

Current example:

- `OrderDTO` lives in `src/application/Order/dtos/OrderDto.ts`
- `OrderSchema` lives in `src/presentation/aws-apigateway/create_order.ts`
- the SQS handler currently reuses `OrderSchema`

If a new listener reuses the same payload contract, keep the DTO and schema unchanged.

If the payload contract changes, update the DTO and validation schema intentionally and keep `Events.Mappings` aligned.

For repository-facing/domain DTOs introduced by the listener flow, keep property names in PascalCase when that module follows the project contract style, for example `Id`, `ProductId`, `Total`, `Reserved`, `Available`.

When rehydrating an aggregate from persistence, prefer extending the existing `create(...)` factory with the persisted state it needs instead of adding a second `restore(...)` factory by default.

## Naming conventions

- Queue names: kebab-case string values in `Events.Queues`
- Terraform queue resources: snake_case
- Lambda names: kebab-case AWS function names
- Lambda handler file names: snake_case TypeScript files under `src/presentation/aws-sqs`
- Use cases: PascalCase ending with `Usecase`
- Repositories: PascalCase interfaces and `Dynamo...Repository` implementations

## Terraform notes

`terraform/aws_eventbridge.tf` holds the EventBridge-to-SQS mapping.

When adding a new listener for a new event, verify whether both are needed:

- a new `aws_cloudwatch_event_rule`
- a new `aws_cloudwatch_event_target` pointing to the queue ARN

`terraform/aws_lambdas.tf` currently centralizes:

- Lambda IAM role
- role policy document
- DynamoDB table permissions
- SQS queue permissions
- Lambda functions
- event source mappings

When adding a new listener, review whether existing IAM statements must be extended for:

- the new queue ARN
- the new DynamoDB table ARN

`terraform/aws_sqs.tf` should prefer one shared EventBridge send policy document reused by multiple queue policy resources when the allowed producer is the same.

`terraform/aws_dynamodb.tf` should keep the same GSI declaration style used by the existing tables:

- define the indexed attributes explicitly
- use `key_schema` inside `global_secondary_index`

Avoid mixing styles for indexes inside the same repository.

## Shared utilities

- `src/shared/parseSqsEvent.ts` parses the EventBridge envelope delivered through SQS.
- `src/shared/parsebody.ts` is used by parsing helpers.
- `src/shared/logger.ts` handles logs.

## Error pattern

When a use case needs a named business failure, add a custom error to `src/domain/Error/errors.ts` and throw that error from the use case.

Current example:

- `NotificationAlreadySentError`
- `InventoryNotFoundError`
