# SQS Listener Patterns

Use this file to rebuild context before creating or modifying SQS listener transport.

## Source of truth

- `src/application/Event/Events.ts`
  - `Events.Names` defines event names used by EventBridge.
  - `Events.Queues` defines queue names used by SQS consumers.
  - `Events.Mappings` binds each event name to its DTO.

Keep names synchronized with Terraform and handler files.

## Current listener example

The current SQS listener is `notify_library_book_registered`.

Relevant transport files:

- `src/presentation/aws-sqs/notify_library_book_registered.ts`
- `terraform/aws_sqs.tf`
- `terraform/aws_eventbridge.tf`
- `terraform/aws_lambdas.tf`

Current flow:

1. A use case publishes an event to EventBridge.
2. EventBridge rule sends the event to the SQS queue.
3. Lambda receives an SQS event.
4. Handler parses each record with `parseSqsRecord`.
5. The message body contains an EventBridge envelope with `detail-type` and `detail`.
6. The handler validates `detail` with the appropriate schema.
7. The handler calls an existing use case or performs listener-side notification work.

## Boundary with domain skill

Do not create or modify these from this skill:

- `src/domain/**`
- `src/application/<Domain>/Usecase/**`
- `src/application/<Domain>/repositories/**`
- `src/infrastructure/aws-dynamodb-repositories/**`
- `terraform/aws_dynamodb.tf`
- DynamoDB table ARNs in `terraform/aws_lambdas.tf`

If any of those are needed, use `$create-domain-boilerplate` first.

## DTO and schema rule

Always confirm whether the DTO or schema must change before editing any existing contract file.

Current example:

- `BookDTO` lives in `src/application/Book/dtos/BookDto.ts`
- `RegisterBookSchema` and `BookDTOSchema` live in `src/presentation/zod/BookSchemas.ts`
- the SQS handler currently reuses `BookDTOSchema`

If a new listener reuses the same payload contract, keep the DTO and schema unchanged.

If the payload contract changes, update the DTO and validation schema intentionally and keep `Events.Mappings` aligned.

## Naming conventions

- Queue names: kebab-case string values in `Events.Queues`
- Terraform queue resources: snake_case
- Lambda names: kebab-case AWS function names
- Lambda handler file names: snake_case TypeScript files under `src/presentation/aws-sqs`

## Terraform notes

`terraform/aws_eventbridge.tf` holds the EventBridge-to-SQS mapping.

When adding a new listener for a new event, verify whether both are needed:

- a new `aws_cloudwatch_event_rule`
- a new `aws_cloudwatch_event_target` pointing to the queue ARN

`terraform/aws_lambdas.tf` currently centralizes:

- Lambda IAM role
- role policy document
- SQS queue permissions
- Lambda functions
- event source mappings

When adding a new listener, review whether existing IAM statements must be extended for the new queue ARN.

Do not add DynamoDB table ARNs from this skill. Use `$create-domain-boilerplate` when new persisted domain infrastructure is required.

`terraform/aws_sqs.tf` should prefer one shared EventBridge send policy document reused by multiple queue policy resources when the allowed producer is the same.

## Shared utilities

- `src/shared/parseSqsEvent.ts` parses the EventBridge envelope delivered through SQS.
- `src/shared/parsebody.ts` is used by parsing helpers.
- `src/shared/logger.ts` handles logs.
