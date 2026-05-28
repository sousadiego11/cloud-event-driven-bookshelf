# Project patterns

Use this file to rebuild context before creating or modifying an SQS listener in this repository.

## Source of truth

- `src/application/Event/Events.ts`
  - `Events.Names` defines event names used by EventBridge.
  - `Events.Queues` defines queue names used by SQS consumers.
  - `Events.Mappings` binds each event name to its DTO.

Keep names synchronized with Terraform and handler files.

## Current listener example

The current SQS listener is `notify_library_book_registered`.

Relevant files:

- `src/presentation/aws-sqs/notify_library_book_registered.ts`
- `src/application/Book/Usecase/RegisterBookUsecase.ts`
- `src/infrastructure/aws-dynamodb-repositories/dynamodb-books-repository.ts`
- `terraform/aws_sqs.tf`
- `terraform/aws_eventbridge.tf`
- `terraform/aws_lambdas.tf`
- `terraform/aws_dynamodb.tf`

Current flow:

1. API Gateway calls `register_book`.
2. The handler validates the register-book input.
3. The use case creates and persists a `Book`.
4. The use case publishes `BookRegistered` to EventBridge.
5. EventBridge rule sends the event to the SQS queue.
6. Lambda receives an SQS event.
7. Handler parses each record with `parseSqsRecord`.
8. The message body contains an EventBridge envelope with `detail-type` and `detail`.
9. The handler validates `detail` with `BookDTOSchema`.
10. The handler logs a library notification.

## DTO and schema rule

Always confirm whether the DTO or schema must change before editing any existing contract file.

Current example:

- `BookDTO` lives in `src/application/Book/dtos/BookDto.ts`
- `RegisterBookSchema` and `BookDTOSchema` live in `src/presentation/zod/BookSchemas.ts`
- the SQS handler currently reuses `BookDTOSchema`

If a new listener reuses the same payload contract, keep the DTO and schema unchanged.

If the payload contract changes, update the DTO and validation schema intentionally and keep `Events.Mappings` aligned.

For repository-facing/domain DTOs introduced by a listener flow, keep property names in PascalCase when that module follows the project contract style, for example `Id`, `Title`, `Author`, `RegisteredAt`.

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
- any DynamoDB table ARN used by the handler/use case

`terraform/aws_sqs.tf` should prefer one shared EventBridge send policy document reused by multiple queue policy resources when the allowed producer is the same.

`terraform/aws_dynamodb.tf` should keep the same GSI declaration style used by the existing tables:

- define the indexed attributes explicitly
- use `key_schema` inside `global_secondary_index`

## Shared utilities

- `src/shared/parseSqsEvent.ts` parses the EventBridge envelope delivered through SQS.
- `src/shared/parsebody.ts` is used by parsing helpers.
- `src/shared/logger.ts` handles logs.
